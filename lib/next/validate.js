const { validateMessage } = require('./validateMessage');

/**
 * Validates the given HTTP messages pair and returns
 * a legacy-compliant validation results.
 * @param {Object} real
 * @param {Object} expected
 * @param {(error: Error, result: Object) => void} callback
 */
function validate(real, expected, callback) {
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
