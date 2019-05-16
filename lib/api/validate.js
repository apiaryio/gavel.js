const { validateMessage } = require('./validateMessage');

function validate(real, expected, type, callback) {
  if (type !== 'request' && type !== 'response') {
    throw new Error(
      `Can't validate: expected transaction "type" to be "request" or "response", but got: ${type}.`
    );
  }

  let results;

  try {
    results = validateMessage(real, expected);
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
