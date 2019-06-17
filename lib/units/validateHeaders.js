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
function validateHeaders(expected, real) {
  const expectedType = getHeadersType(expected.headers);
  const realType = getHeadersType(real.headers);
  const errors = [];

  const hasJsonHeaders =
    realType === APIARY_JSON_HEADER_TYPE &&
    expectedType === APIARY_JSON_HEADER_TYPE;

  const validator = hasJsonHeaders
    ? new HeadersJsonExample(real.headers, expected.headers)
    : null;
  const rawData = validator && validator.validate();

  if (validator) {
    errors.push(...validator.evaluateOutputToResults());
  } else {
    errors.push({
      message: `\
No validator found for real data media type
"${realType}"
and expected data media type
"${expectedType}".\
`
    });
  }

  return {
    isValid: isValidField({ errors }),
    validator: validator && 'HeadersJsonExample',
    realType,
    expectedType,
    rawData,
    errors
  };
}

module.exports = { validateHeaders };
