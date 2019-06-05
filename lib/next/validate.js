const { validateMessage } = require('./validateMessage');

/**
 * Validates the given HTTP messages pair and returns
 * a legacy-compliant validation results.
 * @param {Object<string, key>} real
 * @param {Object<string, key>} expected
 * @param {(error: Error, result: Object<string, key>) => void} callback
 */
function validate(expected, real, callback) {
  let result;

  try {
    result = validateMessage(expected, real);
  } catch (error) {
    if (callback) {
      callback(error, null);
    }

    return result;
  }

  if (callback) {
    callback(null, {
      version: '2',
      ...result
    });
  }

  return result;
}

module.exports = validate;
