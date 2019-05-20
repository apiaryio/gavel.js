const { HeadersJsonExample } = require('../../validators/headers-json-example');

const APIARY_JSON_HEADER_TYPE = 'application/vnd.apiary.http-headers+json';

function getHeadersType(headers) {
  return headers instanceof Object && !Array.isArray(headers)
    ? APIARY_JSON_HEADER_TYPE
    : null;
}

/**
 * Validates given real and expected transaction elements.
 * @param {Object} real
 * @param {Object} expected
 */
function validateHeaders(real, expected) {
  const realType = getHeadersType(real.headers);
  const expectedType = getHeadersType(expected.headers);
  const results = [];

  const hasJsonHeaders =
    realType === APIARY_JSON_HEADER_TYPE &&
    expectedType === APIARY_JSON_HEADER_TYPE;

  const validator = hasJsonHeaders
    ? new HeadersJsonExample(real.headers, expected.headers)
    : null;
  const rawData = validator && validator.validate();

  if (validator) {
    results.push(...validator.evaluateOutputToResults());
  } else {
    results.push({
      message: `\
No validator found for real data media type
"${realType}"
and expected data media type
"${expectedType}".\
`,
      severity: 'error'
    });
  }

  return {
    validator: validator && 'HeadersJsonExample',
    realType,
    expectedType,
    rawData,
    results
  };
}

module.exports = { validateHeaders };
