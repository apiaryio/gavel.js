/**
 * Validates given real and expected status codes.
 * @param {Object} real
 * @param {number} expected
 */
function validateStatusCode(expected, real) {
  const valid = real.statusCode === expected.statusCode;
  const errors = [];

  if (!valid) {
    errors.push({
      message: `Status code is '${real.statusCode}' instead of '${expected.statusCode}'`,
      values: {
        expected: expected.statusCode,
        actual: real.statusCode
      }
    });
  }

  return {
    valid,
    kind: 'text',
    errors
  };
}

module.exports = { validateStatusCode };
