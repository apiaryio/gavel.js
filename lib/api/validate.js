const { normalize } = require('./units/normalize');
const { validateMessage } = require('./validateMessage');

function validate(real, expected, type, callback) {
  const normalizedReal = normalize(real);
  const normalizedExpected = normalize(expected);

  if (type !== 'request' && type !== 'response') {
    throw new Error(
      `Can't validate: expected transaction "type" to be "request" or "response", but got: ${type}.`
    );
  }

  let results;

  try {
    results = validateMessage(normalizedReal, normalizedExpected);
  } catch (error) {
    callback(error, null);
    return;
  }

  callback(null, {
    version: '2',
    ...results
  });
}

module.exports = validate;
