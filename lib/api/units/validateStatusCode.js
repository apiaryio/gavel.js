const { TextDiff } = require('../../validators/text-diff');

const APIARY_STATUS_CODE_TYPE = 'text/vnd.apiary.status-code';

function normalizeStatusCode(statusCode) {
  return String(statusCode).trim();
}

/**
 * Validates given real and expected status codes.
 * @param {Object} real
 * @param {number} expected
 */
function validateStatusCode(real, expected) {
  const validator = new TextDiff(
    normalizeStatusCode(real.statusCode),
    normalizeStatusCode(expected.statusCode)
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

module.exports = { validateStatusCode };
