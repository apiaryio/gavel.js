function validateMethod(expected, actual) {
  const values = {
    expected: expected.method,
    actual: actual.method
  };
  const valid = values.actual === values.expected;
  const errors = [];

  if (!valid) {
    errors.push({
      message: `Expected method '${values.expected}', but got '${values.actual}'.`
    });
  }

  return {
    valid,
    kind: 'text',
    values,
    errors
  };
}

module.exports = { validateMethod };
