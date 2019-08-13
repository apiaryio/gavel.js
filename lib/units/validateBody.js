const mediaTyper = require('media-typer');
const contentTypeUtils = require('content-type');

const { isValidField } = require('./isValid');
const { TextDiff, JsonExample, JsonSchema } = require('../validators');
const isset = require('../utils/isset');
const parseJson = require('../utils/parseJson');

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
 * @param {'actual'|'expected'} httpMessageOrigin
 * @returns {[string, MediaType]}
 */
function getBodyType(body, contentType, httpMessageOrigin) {
  const hasJsonContentType = isJsonContentType(contentType);

  try {
    // Use strict JSON parsing for actual body.
    // This prevents any kind of normalization of trailing commas
    // and other custom transformations applied by "jju".
    parseJson(body);

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
    parseJson(bodySchema);
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
 * actual and expected body media types.
 * @param {MediaType} expectedType
 * @param {MediaType} actualType
 * @returns {Validator}
 */
function getBodyValidator(expectedType, actualType) {
  const both = (predicate) => (expected, actual) => {
    return [expected, actual].every(predicate);
  };

  const validators = [
    [TextDiff, both(isPlainText), 'text'],
    // List JsonSchema first, because weak predicate of JsonExample
    // would resolve on "application/schema+json" media type too.
    [
      JsonSchema,
      (expected, actual) => {
        return isJson(actual) && isJsonSchema(expected);
      },
      'json'
    ],
    [JsonExample, both(isJson), 'json']
  ];

  const validator = validators.find(([_name, predicate]) => {
    return predicate(expectedType, actualType);
  });

  if (!validator) {
    const error = `Can't validate actual media type '${mediaTyper.format(
      actualType
    )}' against the expected media type '${mediaTyper.format(expectedType)}'.`;
    return [error, null, null];
  }

  return [null, validator[0], validator[2]];
}

/**
 * Validates given bodies of transaction elements.
 * @param {Object<string, any>} expected
 * @param {Object<string, any>} actual
 */
function validateBody(expected, actual) {
  const values = {
    actual: actual.body
  };

  // Prevent assigning { expected: undefined }.
  // Also ignore "bodySchema" as the expected value.
  if (isset(expected.body)) {
    values.expected = expected.body;
  }

  const errors = [];
  const actualBodyType = typeof actual.body;
  const hasEmptyActualBody = actual.body === '';

  // Throw when user input for actual body is not a string.
  if (actualBodyType !== 'string') {
    throw new Error(
      `Expected HTTP body to be a string, but got: ${actualBodyType}`
    );
  }

  const [actualTypeError, actualType] = getBodyType(
    actual.body,
    actual.headers && actual.headers['content-type'],
    'actual'
  );

  const [expectedTypeError, expectedType] = expected.bodySchema
    ? getBodySchemaType(expected.bodySchema)
    : getBodyType(
        expected.body,
        expected.headers && expected.headers['content-type'],
        'expected'
      );

  if (actualTypeError) {
    errors.push({
      message: actualTypeError
    });
  }

  if (expectedTypeError) {
    errors.push({
      message: expectedTypeError
    });
  }

  const hasErrors = errors.length > 0;

  // Skipping body validation in case errors during
  // actual/expected body type definition.
  const [validatorError, ValidatorClass, kind] = hasErrors
    ? [null, null, null]
    : getBodyValidator(expectedType, actualType);

  if (validatorError) {
    // In case determined media types mismtach, check if the actual is not missing.
    // Keep in mind the following scenarios:
    // 1. Expected '', and got '' (TextDiff/TextDiff, valid)
    // 2. Expected {...}, but got '' (Json/TextDiff, invalid, produces "missing actual body" error)
    // 3. Expected {...}, but got "foo" (Json/TextDiff, invalid, produces types mismatch error).
    if (expected.body !== '' && hasEmptyActualBody) {
      errors.push({
        message: `Expected "body" of "${mediaTyper.format(
          expectedType
        )}" media type, but actual "body" is missing.`
      });
    } else {
      errors.push({
        message: validatorError
      });
    }
  }

  const usesJsonSchema = ValidatorClass && ValidatorClass.name === 'JsonSchema';
  const validator =
    ValidatorClass &&
    new ValidatorClass(
      usesJsonSchema ? expected.bodySchema : expected.body,
      actual.body
    );

  // Calling "validate()" often updates an internal state of a validator.
  // That state is later used to output the gavel-compliant results.
  // Cannot remove until validators are refactored into simple functions.
  // @see https://github.com/apiaryio/gavel.js/issues/150
  validator && validator.validate();
  const validationErrors = validator ? validator.evaluateOutputToResults() : [];
  errors.push(...validationErrors);

  return {
    valid: isValidField({ errors }),
    kind,
    values,
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
