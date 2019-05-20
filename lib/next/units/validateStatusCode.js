const { textDiff } = require('../validators/text-diff');

const APIARY_STATUS_CODE_TYPE = 'text/vnd.apiary.status-code';

/**
 * Validates status codes in the given HTTP messages.
 * @param {Object} real
 * @param {Object} expected
 */
function validateStatusCode(real, expected) {
  const rawData = textDiff(real.statusCode, expected.statusCode);
  const results = textDiff.toResults(rawData);

  return {
    validator: 'TextDiff',
    realType: APIARY_STATUS_CODE_TYPE,
    expectedType: APIARY_STATUS_CODE_TYPE,
    rawData,
    results
  };
}

module.exports = { validateStatusCode };
