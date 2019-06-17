const jph = require('json-parse-helpfulerror');
const mediaTyper = require('media-typer');
const contentTypeUtils = require('content-type');

const { TextDiff, JsonExample, JsonSchema } = require('../validators');
const { isValidComponent } = require('./isValid');

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
  } catch (exception) {
    const error = `Can't validate: expected body JSON Schema is not a parseable JSON:\n${
      exception.message
    }`;

    return [error, null];
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
    [TextDiff, both(isPlainText)],
    // List JsonSchema first, because weak predicate of JsonExample
    // would resolve on "application/schema+json" media type too.
    [
      JsonSchema,
      (real, expected) => {
        return isJson(real) && isJsonSchema(expected);
      }
    ],
    [JsonExample, both(isJson)]
  ];

  const validator = validators.find(([_name, predicate]) => {
    return predicate(realType, expectedType);
  });

  if (!validator) {
    const error = `Can't validate real media type '${mediaTyper.format(
      realType
    )}' against expected media type '${mediaTyper.format(expectedType)}'.`;
    return [error, null];
  }

  return [null, validator[0]];
}

/**
 * Validates given bodies of transaction elements.
 * @param {Object<string, any>} expected
 * @param {Object<string, any>} real
 */
function validateBody(expected, real) {
  const errors = [];
  const bodyType = typeof real.body;

  if (bodyType !== 'string') {
    throw new Error(`Expected HTTP body to be a String, but got: ${bodyType}`);
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
      message: realTypeError
    });
  }

  if (expectedTypeError) {
    errors.push({
      message: expectedTypeError
    });
  }

  const hasErrors = errors.length > 0;

  // Skipping body validation in case errors during
  // real/expected body type definition.
  const [validatorError, ValidatorClass] = hasErrors
    ? [null, null]
    : getBodyValidator(realType, expectedType);

  if (validatorError) {
    errors.push({
      message: validatorError
    });
  }

  const usesJsonSchema = ValidatorClass && ValidatorClass.name === 'JsonSchema';
  const validator =
    ValidatorClass &&
    new ValidatorClass(
      real.body,
      usesJsonSchema ? expected.bodySchema : expected.body
    );
  const rawData = validator && validator.validate();
  const validationErrors = validator ? validator.evaluateOutputToResults() : [];
  errors.push(...validationErrors);

  return {
    isValid: isValidComponent(errors),
    validator: ValidatorClass && ValidatorClass.name,
    realType: mediaTyper.format(realType),
    expectedType: mediaTyper.format(expectedType),
    rawData,
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
