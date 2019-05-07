const jph = require('json-parse-helpfulerror');
const mediaTyper = require('media-typer');
const contentType = require('content-type');
const isset = require('../utils/isset');
const validators = require('../validators');

const APIARY_VENDOR_HEADER = 'application/vnd.apiary.http-headers+json';

class Validatable {
  validate() {
    this.validation = {
      version: '2'
    };
    this.lowercaseHeaders();

    if (this.headers && this.expected && this.expected.headers) {
      this.validateHeaders();
    }

    if (
      isset(this.body) &&
      (isset(this.expected.body) || isset(this.expected.bodySchema))
    ) {
      this.validateBody();
    }

    if (this.statusCode) {
      this.validateStatusCode();
    }

    return this.validation;
  }

  isValidatable() {
    return this.constructor.validatableComponents.some((component) => {
      return typeof this[component] !== 'undefined';
    });
  }

  isValid() {
    if (!this.validation) {
      this.validate();
    }

    const hasInvalidComponent = this.constructor.validatableComponents.some(
      (component) => {
        const validationCounterpart = this.validation[component];
        const componentResults =
          validationCounterpart && validationCounterpart.results;

        return (
          componentResults &&
          componentResults.some((result) => {
            return result.severity === 'error';
          })
        );
      }
    );

    return !hasInvalidComponent;
  }

  validationResults() {
    if (!this.validation) {
      this.validate();
    }

    return this.validation;
  }

  lowercaseHeaders() {
    if (this.headers) {
      this.headers = Object.keys(this.headers).reduce(
        (acc, headerName) =>
          Object.assign({}, acc, {
            [headerName.toLowerCase()]: this.headers[headerName]
          }),
        {}
      );
    }

    const { headers: expectedHeaders } = this.expected || {};
    if (expectedHeaders) {
      this.expected.headers = Object.keys(expectedHeaders).reduce(
        (acc, headerName) =>
          Object.assign({}, acc, {
            [headerName.toLowerCase()]: expectedHeaders[headerName]
          }),
        {}
      );
    }
  }

  ensureValidationHeaders() {
    const existingValidation = this.validation;
    if (!existingValidation || !existingValidation.headers) {
      this.validation = Object.assign({}, existingValidation, {
        headers: {
          results: []
        }
      });
    }
  }

  validateHeaders() {
    this.ensureValidationHeaders();
    this.setHeadersRealType();
    this.setHeadersExpectedType();
    this.setHeadersValidator();
    this.runHeadersValidator();
  }

  setHeadersRealType() {
    this.ensureValidationHeaders();
    const { headers } = this;
    this.validation.headers.realType =
      headers instanceof Object && !Array.isArray(headers)
        ? APIARY_VENDOR_HEADER
        : null;
  }

  setHeadersExpectedType() {
    this.ensureValidationHeaders();
    const expectedHeaders = this.expected.headers;
    this.validation.headers.expectedType =
      expectedHeaders instanceof Object && !Array.isArray(expectedHeaders)
        ? APIARY_VENDOR_HEADER
        : null;
  }

  setHeadersValidator() {
    const expectsJson = APIARY_VENDOR_HEADER;

    if (
      this.validation.headers.realType === expectsJson &&
      this.validation.headers.expectedType === expectsJson
    ) {
      this.validation.headers.validator = 'HeadersJsonExample';
    } else {
      this.validation.headers.validator = null;

      if (!this.validation.headers.results) {
        this.validation.headers.results = [];
      }

      const entry = {
        message: `\
No validator found for real data media type \
"${JSON.stringify(this.validation.headers.realType)}" \
and expected data media type \
"${JSON.stringify(this.validation.headers.expectedType)}".\
        `,
        severity: 'error'
      };

      this.validation.headers.results.push(entry);
    }
  }

  runHeadersValidator() {
    // throw new Error JSON.stringify @validation.headers.validator, null, 2
    let validator;

    if (this.validation.headers.validator == null) {
      this.validation.headers.rawData = null;
    } else {
      const ValidatorClass = validators[this.validation.headers.validator];
      validator = new ValidatorClass(this.headers, this.expected.headers);
      this.validation.headers.rawData = validator.validate();
    }

    if (!Array.isArray(this.validation.headers.results)) {
      this.validation.headers.results = [];
    }

    if (this.validation.headers.rawData !== null) {
      const results = validator.evaluateOutputToResults();
      this.validation.headers.results = results.concat(
        this.validation.headers.results
      );
    }
  }

  validateBody() {
    this.validation.body = {};
    this.validation.body.results = [];

    this.setBodyRealType();
    this.setBodyExpectedType();
    this.setBodyValidator();
    this.runBodyValidator();
  }

  setBodyRealType() {
    this.validation.body.realType = null;
    const bodyType = typeof this.body;

    if (bodyType !== 'string') {
      throw new Error(
        `Expected HTTP body to be a String, but got: ${bodyType}`
      );
    }

    const headersContentType = this.headers && this.headers['content-type'];

    if (this.isJsonContentType(headersContentType)) {
      try {
        jph.parse(this.body);
        this.validation.body.realType = headersContentType;
      } catch (error) {
        const message = {
          message: `\
Real body 'Content-Type' header is '${headersContentType}' \
but body is not a parseable JSON:\n${error.message}\
`,
          severity: 'error'
        };

        this.validation.body.results.push(message);
      }
    } else {
      try {
        jph.parse(this.body);
        this.validation.body.realType = 'application/json';
      } catch (error) {
        this.validation.body.realType = 'text/plain';
      }
    }
  }

  setBodyExpectedType() {
    this.validation.body.expectedType = null;

    if (this.validation.body.results == null) {
      this.validation.body.results = [];
    }

    if (this.expected.bodySchema != null) {
      if (typeof this.expected.bodySchema === 'string') {
        try {
          const parsed = jph.parse(this.expected.bodySchema);

          if (typeof parsed === 'object') {
            this.validation.body.expectedType = 'application/schema+json';
          } else {
            // Explicit empty error to be caught by the underlying "catch" block.
            // Introduced to remove nasty shadowing and local variables mutations.
            // TODO https://github.com/apiaryio/gavel.js/issues/150
            throw new Error('');
          }
        } catch (error) {
          this.validation.body.results.push({
            message: `Can't validate. Expected body JSON Schema is not a parseable JSON:\n${
              error.message
            }`,
            severity: 'error'
          });
        }
      } else {
        this.validation.body.expectedType = 'application/schema+json';
      }
    } else {
      const expectedContentType =
        this.expected.headers != null
          ? this.expected.headers['content-type']
          : undefined;

      if (this.isJsonContentType(expectedContentType)) {
        try {
          jph.parse(this.expected.body);
          this.validation.body.expectedType = expectedContentType;
        } catch (error) {
          this.validation.body.results.push({
            message: `\
Can't validate. Expected body 'Content-Type' is '${expectedContentType}' \
but body is not a parseable JSON:\n${error.message}\
`,
            severity: 'error'
          });
        }
      } else {
        try {
          jph.parse(this.expected.body);
          this.validation.body.expectedType = 'application/json';
        } catch (error) {
          this.validation.body.expectedType = 'text/plain';
        }
      }
    }
  }

  setBodyValidator() {
    this.validation.body.validator = null;

    if (this.validation.body.results == null) {
      this.validation.body.results = [];
    }

    const validationErrors = this.validation.body.results.filter((result) =>
      ['error'].includes(result.severity)
    );
    const errorsLength = validationErrors.length;

    if (errorsLength === 0) {
      if (this.isJsonContentType(this.validation.body.realType)) {
        if (this.validation.body.expectedType === 'application/schema+json') {
          this.validation.body.validator = 'JsonSchema';
        } else if (this.isJsonContentType(this.validation.body.expectedType)) {
          this.validation.body.validator = 'JsonExample';
        } else {
          this.validation.body.results.push({
            message: `Can't validate real media type '${
              this.validation.body.realType
            }' against expected media type '${
              this.validation.body.expectedType
            }'.`,
            severity: 'error'
          });
        }
      } else if (this.validation.body.realType === 'text/plain') {
        if (this.validation.body.expectedType === 'text/plain') {
          this.validation.body.validator = 'TextDiff';
        } else {
          this.validation.body.results.push({
            message: `Can't validate real media type '${
              this.validation.body.realType
            }' against expected media type '${
              this.validation.body.expectedType
            }'.`,
            severity: 'error'
          });
        }
      } else {
        this.validation.body.results.push({
          message: `Can't validate real media type '${
            this.validation.body.realType
          }' against expected media type '${
            this.validation.body.expectedType
          }'.`,
          severity: 'error'
        });
      }
    }
  }

  /*
   * decaffeinate suggestions:
   * DS102: Remove unnecessary code created because of implicit returns
   * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
   */
  runBodyValidator() {
    if (this.validation.body.validator === null) {
      this.validation.body.rawData = null;
    } else {
      let expected;
      let real;
      let results;

      const ValidatorClass = validators[this.validation.body.validator];

      if (this.validation.body.validator === 'JsonSchema') {
        real = this.body;
        expected = this.expected.bodySchema;
      } else {
        real = this.body;
        expected = this.expected.body;
      }

      if (this.validation.body.validator !== null) {
        if (!Array.isArray(this.validation.body.results)) {
          this.validation.body.results = [];
        }
      }

      try {
        const validator = new ValidatorClass(real, expected);
        this.validation.body.rawData = validator.validate();

        results = validator.evaluateOutputToResults();
        this.validation.body.results = results.concat(
          this.validation.body.results
        );
      } catch (error) {
        const message = {
          message: error.message,
          severity: 'error'
        };

        this.validation.body.results.push(message);
      }
    }
  }

  validateStatusCode() {
    this.validation.statusCode = {};
    this.validation.statusCode.realType = 'text/vnd.apiary.status-code';
    this.validation.statusCode.expectedType = 'text/vnd.apiary.status-code';
    this.validation.statusCode.validator = 'TextDiff';

    const real = String(this.statusCode).trim();
    const expected = String(this.expected.statusCode).trim();

    const validator = new validators.TextDiff(real, expected);
    this.validation.statusCode.rawData = validator.validate();

    this.validation.statusCode.results = [];
    const results = validator.evaluateOutputToResults();
    this.validation.statusCode.results = results.concat(
      this.validation.statusCode.results
    );

    this.validation.statusCode.results = this.validation.statusCode.results.map(
      (current) =>
        Object.assign({}, current, {
          message:
            current.message === 'Real and expected data does not match.'
              ? `Status code is '${real}' instead of '${expected}'`
              : current.message
        })
    );
  }

  isJsonContentType(contentTypeValue) {
    if (!contentTypeValue) {
      return false;
    }
    try {
      const { type } = contentType.parse(`${contentTypeValue}`);
      const parsed = mediaTyper.parse(type);
      return (
        (parsed.type === 'application' && parsed.subtype === 'json') ||
        parsed.suffix === 'json'
      );
    } catch (e) {
      // The Content-Type value is basically a user input, it can be any
      // kind of rubbish, and it is neither this function's nor Gavel's problem
      // if it's invalid
      return false;
    }
  }
}

Validatable.validatableComponents = ['headers', 'body', 'statusCode'];

module.exports = {
  Validatable
};
