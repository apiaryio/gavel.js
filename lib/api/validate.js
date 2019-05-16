const normalize = require('./units/normalize');
const validateElement = require('./validateElement');

function validate(real, expected, type, callback) {
  const normalizedReal = normalize(real);
  const normalizedExpected = normalize(expected);

  if (type !== 'request' && type !== 'response') {
    throw new Error(
      `Can't validate: expected transaction "type" to be "request" or "response", but got: ${type}.`
    );
  }

  const results = validateElement(normalizedReal, normalizedExpected);

  // TODO Propagate the error.
  callback(null, {
    version: '2',
    ...results
  });
}

module.exports = validate;
