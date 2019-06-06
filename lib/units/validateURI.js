const APIARY_URI_TYPE = 'text/vnd.apiary.uri';

const validateURI = (expected, real) => {
  const { uri: expectedURI } = expected;
  const { uri: realURI } = real;
  const errors = [];
  const isValid = expectedURI === realURI;

  if (!isValid) {
    errors.push({
      message: `Expected "uri" field to equal "${expectedURI}", but got "${realURI}".`
    });
  }

  return {
    isValid,
    validator: null,
    expectedType: APIARY_URI_TYPE,
    realType: APIARY_URI_TYPE,
    errors
  };
};

module.exports = { validateURI };
