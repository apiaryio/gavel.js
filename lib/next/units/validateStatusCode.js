const APIARY_STATUS_CODE_TYPE = 'text/vnd.apiary.status-code';

/**
 * Validates given real and expected status codes.
 * @param {Object} real
 * @param {number} expected
 */
function validateStatusCode(real, expected) {
  const results = [];
  const isValid = real.statusCode === expected.statusCode;

  if (!isValid) {
    results.push({
      message: `Status code is '${real.statusCode}' instead of '${
        expected.statusCode
      }'`,
      severity: 'error'
    });
  }

  return {
    validator: 'TextDiff',
    realType: APIARY_STATUS_CODE_TYPE,
    expectedType: APIARY_STATUS_CODE_TYPE,
    rawData: '',
    results
  };
}

module.exports = { validateStatusCode };
