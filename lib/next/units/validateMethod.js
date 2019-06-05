const APIARY_METHOD_TYPE = 'text/vnd.apiary.method';

function validateMethod(real, expected) {
  const { method: realMethod } = real;
  const { method: expectedMethod } = expected;
  const errors = [];
  const isValid = realMethod === expectedMethod;

  if (!isValid) {
    errors.push({
      message: `Expected "method" field to equal "${expectedMethod}", but got "${realMethod}".`
    });
  }

  return {
    isValid,
    validator: null,
    realType: APIARY_METHOD_TYPE,
    expectedType: APIARY_METHOD_TYPE,
    errors
  };
}

module.exports = { validateMethod };
