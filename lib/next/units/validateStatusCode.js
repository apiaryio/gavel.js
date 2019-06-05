const APIARY_STATUS_CODE_TYPE = 'text/vnd.apiary.status-code';

/**
 * Validates given real and expected status codes.
 * @param {Object} real
 * @param {number} expected
 */
function validateStatusCode(real, expected) {
  const errors = [];
  const isValid = real.statusCode === expected.statusCode;

  if (!isValid) {
    errors.push({
      message: `Status code is '${real.statusCode}' instead of '${
        expected.statusCode
      }'`
    });
  }

  return {
    isValid,
    validator: 'TextDiff',
    realType: APIARY_STATUS_CODE_TYPE,
    expectedType: APIARY_STATUS_CODE_TYPE,
    rawData: '',
    errors
  };
}

module.exports = { validateStatusCode };
