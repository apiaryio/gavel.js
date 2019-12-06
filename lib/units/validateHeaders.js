const { HeadersJsonExample } = require('../validators');
const { isValidField } = require('./isValid');

const APIARY_JSON_HEADER_TYPE = 'application/vnd.apiary.http-headers+json';

function getHeadersType(headers) {
  return headers instanceof Object && !Array.isArray(headers)
    ? APIARY_JSON_HEADER_TYPE
    : null;
}

/**
 * Validates given real and expected transaction elements.
 * @param {Object<string, any>} expected
 * @param {Object<string, any>} real
 */
function validateHeaders(expected, actual) {
  const values = {
    expected: expected.headers,
    actual: actual.headers
  };
  const expectedType = getHeadersType(values.expected);
  const actualType = getHeadersType(values.actual);
  const errors = [];

  const hasJsonHeaders =
    actualType === APIARY_JSON_HEADER_TYPE &&
    expectedType === APIARY_JSON_HEADER_TYPE;

  const validator = hasJsonHeaders
    ? new HeadersJsonExample(values.expected)
    : null;

  // if you don't call ".validate()", it never evaluates any results.
  const validationErrors = validator && validator.validate(values.actual);

  if (validator) {
    errors.push(...validationErrors);
  } else {
    errors.push({
      message: `\
No validator found for real data media type
"${actualType}"
and expected data media type
"${expectedType}".\
`
    });
  }

  return {
    valid: isValidField({ errors }),
    kind: hasJsonHeaders ? 'json' : 'text',
    values,
    errors
  };
}

module.exports = { validateHeaders };
