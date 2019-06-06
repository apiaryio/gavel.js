const APIARY_STATUS_CODE_TYPE = 'text/vnd.apiary.status-code';

/**
 * Validates given real and expected status codes.
 * @param {Object} real
 * @param {number} expected
 */
function validateStatusCode(expected, real) {
  const isValid = real.statusCode === expected.statusCode;
  const errors = [];

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
    errors
  };
}

module.exports = { validateStatusCode };
