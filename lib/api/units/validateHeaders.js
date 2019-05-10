const { HeadersJsonExample } = require('../../validators/headers-json-example');

const APIARY_JSON_HEADER_TYPE = 'application/vnd.apiary.http-headers+json';

function normalizeHeaders(headers) {
  return (
    headers instanceof Object &&
    Object.keys(headers).reduce(
      (acc, headerName) =>
        Object.assign({}, acc, {
          [headerName.toLowerCase()]: headers[headerName]
        }),
      {}
    )
  );
}

function getHeadersType(headers) {
  return headers instanceof Object && !Array.isArray(headers)
    ? APIARY_JSON_HEADER_TYPE
    : null;
}

/**
 * Validates given real and expected headers.
 * @param {Object} realHeaders
 * @param {Object} expectedHeaders
 */
function validateHeaders(realHeaders, expectedHeaders) {
  const real = normalizeHeaders(realHeaders);
  const expected = normalizeHeaders(expectedHeaders);
  const realType = getHeadersType(real);
  const expectedType = getHeadersType(expected);
  const results = [];

  const hasJsonHeaders =
    realType === APIARY_JSON_HEADER_TYPE &&
    expectedType === APIARY_JSON_HEADER_TYPE;

  const validator = hasJsonHeaders
    ? new HeadersJsonExample(real, expected)
    : null;
  const rawData = validator && validator.validate();

  if (validator) {
    results.push(...validator.evaluateOutputToResults());
  } else {
    results.push({
      message: `\
No validator found for real data media type
"${JSON.stringify(realType)}"
and expected data media type
"${JSON.stringify(expectedType)}".\
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

module.exports = validateHeaders;
