const jph = require('json-parse-helpfulerror');
const mediaTyper = require('media-typer');
const contentTypeUtils = require('content-type');

const { TextDiff, JsonExample, JsonSchema } = require('../validators');
const { isValidField } = require('./isValid');

function isPlainText(mediaType) {
  return mediaType.type === 'text' && mediaType.subtype === 'plain';
}

function isJson(mediaType) {
  if (!mediaType) {
    return false;
  }

  return (
    (mediaType.type === 'application' && mediaType.subtype === 'json') ||
    mediaType.suffix === 'json'
  );
}

function isJsonSchema(mediaType) {
  if (!mediaType) {
    return false;
  }

  return (
    mediaType.type === 'application' &&
    mediaType.subtype === 'schema' &&
    mediaType.suffix === 'json'
  );
}

/**
 * Parses a given content-type header into media type.
 * @param {string} contentType
 * @returns {[Error, MediaType]}
 */
function parseContentType(contentType) {
  try {
    const { type } = contentTypeUtils.parse(`${contentType}`);
    return mediaTyper.parse(type);
  } catch (error) {
    return null;
  }
}

/**
 * Determines if a given 'Content-Type' header contains JSON.
 * @param {string} contentType
 * @returns {boolean}
 */
function isJsonContentType(contentType) {
  const mediaType = parseContentType(contentType);
  return mediaType ? isJson(mediaType) : false;
}

/**
 * Returns a tuple of error and body media type based
 * on the given body and normalized headers.
 * @param {string} body
 * @param {string} contentType
 * @param {'real'|'expected'} httpMessageOrigin
 * @returns {[string, MediaType]}
 */
function getBodyType(body, contentType, httpMessageOrigin) {
  const hasJsonContentType = isJsonContentType(contentType);

  try {
    jph.parse(body);
    const bodyMediaType = parseContentType(
      hasJsonContentType ? contentType : 'application/json'
    );

    return [null, bodyMediaType];
  } catch (parsingError) {
    const fallbackMediaType = mediaTyper.parse('text/plain');
    const error = hasJsonContentType
      ? `Can't validate: ${httpMessageOrigin} body 'Content-Type' header is '${contentType}' \
but body is not a parseable JSON:
${parsingError.message}`
      : null;

    return [error, fallbackMediaType];
  }
}

/**
 * Returns a tuple of error and schema media type
 * based on given body schema.
 * @param {string} bodySchema
 * @returns {[string, string]}
 */
function getBodySchemaType(bodySchema) {
  const jsonSchemaType = mediaTyper.parse('application/schema+json');

  if (typeof bodySchema !== 'string') {
    return [null, jsonSchemaType];
  }

  try {
    jph.parse(bodySchema);
    return [null, jsonSchemaType];
  } catch (error) {
    // Gavel must throw when given malformed JSON Schema.
    // See https://github.com/apiaryio/gavel.js/issues/203
    throw new Error(`\
Failed to validate HTTP message "body": given JSON Schema is not a valid JSON.

${error.message}\
`);
  }
}

/**
 * Returns a body validator class based on the given
 * real and expected body media types.
 * @param {MediaType} realType
 * @param {MediaType} expectedType
 * @returns {Validator}
 */
function getBodyValidator(realType, expectedType) {
  const both = (predicate) => (real, expected) => {
    return [real, expected].every(predicate);
  };

  const validators = [
    [TextDiff, both(isPlainText), 'text'],
    // List JsonSchema first, because weak predicate of JsonExample
    // would resolve on "application/schema+json" media type too.
    [
      JsonSchema,
      (real, expected) => {
        return isJson(real) && isJsonSchema(expected);
      },
      'json'
    ],
    [JsonExample, both(isJson), 'json']
  ];

  const validator = validators.find(([_name, predicate]) => {
    return predicate(realType, expectedType);
  });

  if (!validator) {
    const error = `Can't validate real media type '${mediaTyper.format(
      realType
    )}' against expected media type '${mediaTyper.format(expectedType)}'.`;
    return [error, null, null];
  }

  return [null, validator[0], validator[2]];
}

/**
 * Validates given bodies of transaction elements.
 * @param {Object<string, any>} expected
 * @param {Object<string, any>} real
 */
function validateBody(expected, real) {
  const errors = [];
  const realBodyType = typeof real.body;
  const hasEmptyRealBody = real.body === '';
  const values = {
    expected: expected.body,
    actual: real.body
  };

  // Throw when user input for real body is not a string.
  if (realBodyType !== 'string') {
    throw new Error(
      `Expected HTTP body to be a string, but got: ${realBodyType}`
    );
  }

  const [realTypeError, realType] = getBodyType(
    real.body,
    real.headers && real.headers['content-type'],
    'real'
  );

  const [expectedTypeError, expectedType] = expected.bodySchema
    ? getBodySchemaType(expected.bodySchema)
    : getBodyType(
        expected.body,
        expected.headers && expected.headers['content-type'],
        'expected'
      );

  if (realTypeError) {
    errors.push({
      message: realTypeError,
      values
    });
  }

  if (expectedTypeError) {
    errors.push({
      message: expectedTypeError,
      values
    });
  }

  const hasErrors = errors.length > 0;

  // Skipping body validation in case errors during
  // real/expected body type definition.
  const [validatorError, ValidatorClass, kind] = hasErrors
    ? [null, null, null]
    : getBodyValidator(realType, expectedType);

  if (validatorError) {
    // In case determined media types mismtach, check if the real is not missing.
    // Keep in mind the following scenarios:
    // 1. Expected '', and got '' (TextDiff/TextDiff, valid)
    // 2. Expected {...}, but got '' (Json/TextDiff, invalid, produces "missing real body" error)
    // 3. Expected {...}, but got "foo" (Json/TextDiff, invalid, produces types mismatch error).
    if (expected.body !== '' && hasEmptyRealBody) {
      errors.push({
        message: `Expected "body" of "${mediaTyper.format(
          expectedType
        )}" media type, but actual "body" is missing.`,
        values
      });
    } else {
      errors.push({
        message: validatorError,
        values
      });
    }
  }

  const usesJsonSchema = ValidatorClass && ValidatorClass.name === 'JsonSchema';
  const validator =
    ValidatorClass &&
    new ValidatorClass(
      real.body,
      usesJsonSchema ? expected.bodySchema : expected.body
    );
  // Without ".validate()" it cannot evaluate output to result.
  // TODO Re-do this.
  validator && validator.validate();
  const validationErrors = validator ? validator.evaluateOutputToResults() : [];
  errors.push(...validationErrors);

  return {
    valid: isValidField({ errors }),
    kind,
    errors
  };
}

module.exports = {
  validateBody,

  isJson,
  isJsonSchema,
  isJsonContentType,
  parseContentType,
  getBodyType,
  getBodySchemaType,
  getBodyValidator
};
