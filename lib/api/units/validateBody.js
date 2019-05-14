const jph = require('json-parse-helpfulerror');
const mediaTyper = require('media-typer');
const contentTypeUtils = require('content-type');

const { TextDiff } = require('../../../lib/validators/text-diff');
const { JsonExample } = require('../../../lib/validators/json-example');
const { JsonSchema } = require('../../../lib/validators/json-schema');

function isPlainText(mediaType) {
  return mediaType.type === 'text' && mediaType.subtype === 'plain';
}

function isJson(mediaType) {
  return (
    (mediaType.type === 'application' && mediaType.subtype === 'json') ||
    mediaType.suffix === 'json'
  );
}

function isJsonSchema(mediaType) {
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
    const mediaType = mediaTyper.parse(type);
    return [null, mediaType];
  } catch (error) {
    return [error, null];
  }
}

/**
 * Determines if a given 'Content-Type' header contains JSON.
 * @param {string} contentType
 * @returns {boolean}
 */
function isJsonContentType(contentType) {
  // No need to explicitly check for "contentType" existence.
  // In case given content type is invalid, "parseContentType"
  // will return an error, which would be coerced to "false".
  const [error, mediaType] = parseContentType(contentType);

  // Silence an error on purporse because contentType
  // may contain any kind of rubbish.
  return error ? false : isJson(mediaType);
}

/**
 * Returns a tuple of error and body media type based
 * on the given body and normalized headers.
 * @param {string} body
 * @param {Object} headers
 * @returns {[error, bodyType]}
 */
function getBodyType(body, headers) {
  const contentType = headers && headers['content-type'];
  const hasJsonContentType = isJsonContentType(contentType);

  try {
    jph.parse(body);
    const [mediaTypeError, bodyMediaType] = parseContentType(
      hasJsonContentType ? contentType : 'application/json'
    );

    if (mediaTypeError) {
      throw new Error(mediaTypeError);
    }

    return [null, bodyMediaType];
  } catch (parsingError) {
    const fallbackMediaType = mediaTyper.parse('text/plain');
    const error = hasJsonContentType
      ? {
          /**
           * @TODO The same message for real/expected
           * body assertion. Real/expected must be reflected
           * in the error message.
           */
          message: `\
Real body 'Content-Type' header is '${contentType}' \
but body is not a parseable JSON:
${parsingError.message}\
        `,
          severity: 'error'
        }
      : null;

    return [error, fallbackMediaType];
  }
}

/**
 * Returns a tuple of error and schema media type
 * based on given body schema.
 * @param {string} bodySchema
 * @returns {[error, schemaType]}
 */
function getBodySchemaType(bodySchema) {
  const jsonSchemaType = mediaTyper.parse('application/schema+json');

  if (typeof bodySchema !== 'string') {
    return [null, jsonSchemaType];
  }

  try {
    const parsed = jph.parse(bodySchema);
    if (typeof parsed === 'object') {
      return [null, jsonSchemaType];
    }
  } catch (exception) {
    const error = {
      message: `Can't validate. Expected body JSON Schema is not a parseable JSON:\n${
        exception.message
      }`,
      severity: 'error'
    };

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
    const error = {
      message: `Can't validate real media type '${mediaTyper.format(
        realType
      )}' against expected media type '${mediaTyper.format(expectedType)}'.`,
      severity: 'error'
    };
    return [error, null];
  }

  return [null, validator[0]];
}

/**
 * Validates given bodies of transaction elements.
 * @param {Object} real
 * @param {Object} expected
 */
function validateBody(real, expected) {
  const results = [];
  const bodyType = typeof real.body;

  if (bodyType !== 'string') {
    throw new Error(`Expected HTTP body to be a String, but got: ${bodyType}`);
  }

  const [realTypeError, realType] = getBodyType(real.body, real.headers);
  const [expectedTypeError, expectedType] = expected.bodySchema
    ? getBodySchemaType(expected.bodySchema)
    : getBodyType(expected.body, expected.headers);

  if (realTypeError) {
    results.push(realTypeError);
  }

  if (expectedTypeError) {
    results.push(expectedTypeError);
  }

  const hasErrors = results.some((result) =>
    ['error'].includes(result.severity)
  );

  // Skipping body validation in case errors during
  // real/expected body type definition.
  const [validatorError, ValidatorClass] = hasErrors
    ? [null, null]
    : getBodyValidator(realType, expectedType);

  if (validatorError) {
    results.push(validatorError);
  }

  const usesJsonSchema = ValidatorClass && ValidatorClass.name === 'JsonSchema';
  const validator =
    ValidatorClass &&
    new ValidatorClass(
      real.body,
      usesJsonSchema ? expected.bodySchema : expected.body
    );
  const rawData = validator && validator.validate();
  const validatorResults = validator ? validator.evaluateOutputToResults() : [];
  results.push(...validatorResults);

  return {
    validator: ValidatorClass && ValidatorClass.name,
    realType: mediaTyper.format(realType),
    expectedType: mediaTyper.format(expectedType),
    rawData,
    results
  };
}

module.exports = validateBody;
