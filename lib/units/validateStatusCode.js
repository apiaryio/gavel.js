/**
 * Validates given real and expected status codes.
 * @param {Object} real
 * @param {number} expected
 */
function validateStatusCode(expected, actual) {
  const values = {
    expected: expected.statusCode,
    actual: actual.statusCode
  };
  const valid = values.actual === values.expected;
  const errors = [];

  if (!valid) {
    errors.push({
      message: `Expected status code '${values.expected}', but got '${values.actual}'.`
    });
  }

  return {
    valid,
    kind: 'text',
    values,
    errors
  };
}

module.exports = { validateStatusCode };
