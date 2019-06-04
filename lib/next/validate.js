const { validateMessage } = require('./validateMessage');

/**
 * Validates the given HTTP messages pair and returns
 * a legacy-compliant validation results.
 * @param {Object<string, key>} real
 * @param {Object<string, key>} expected
 * @param {(error: Error, result: Object<string, key>) => void} callback
 */
function validate(real, expected, callback) {
  let results;

  try {
    results = validateMessage(real, expected);
  } catch (error) {
    if (callback) {
      callback(error, null);
    }

    return results;
  }

  if (callback) {
    callback(null, {
      version: '2',
      ...results
    });
  }

  return results;
}

module.exports = validate;
