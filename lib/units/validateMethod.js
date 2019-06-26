function validateMethod(expected, real) {
  const { method: expectedMethod } = expected;
  const { method: realMethod } = real;
  const valid = realMethod === expectedMethod;
  const errors = [];

  if (!valid) {
    errors.push({
      message: `Expected "method" field to equal "${expectedMethod}", but got "${realMethod}".`,
      values: {
        expected: expectedMethod,
        actual: realMethod
      }
    });
  }

  return {
    valid,
    kind: 'text',
    errors
  };
}

module.exports = { validateMethod };
