const { TextDiff } = require('../../validators/text-diff');

const APIARY_STATUS_CODE_TYPE = 'text/vnd.apiary.status-code';

function normalizeStatusCode(statusCode) {
  return String(statusCode).trim();
}

/**
 * Validates given real and expected status codes.
 * @param {number} realStatusCode
 * @param {number} expectedStatusCode
 */
function validateStatusCode(realStatusCode, expectedStatusCode) {
  const validator = new TextDiff(
    normalizeStatusCode(realStatusCode),
    normalizeStatusCode(expectedStatusCode)
  );
  const rawData = validator.validate();

  return {
    validator: 'TextDiff',
    realType: APIARY_STATUS_CODE_TYPE,
    expectedType: APIARY_STATUS_CODE_TYPE,
    rawData,
    results: validator.evaluateOutputToResults()
  };
}

module.exports = validateStatusCode;
