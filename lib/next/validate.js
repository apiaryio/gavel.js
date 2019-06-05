const { validateMessage } = require('./validateMessage');

/**
 * Validates the given HTTP messages pair and returns
 * a legacy-compliant validation results.
 * @param {Object<string, key>} expected
 * @param {Object<string, key>} real
 */
function validate(expected, real) {
  return validateMessage(expected, real);
}

module.exports = validate;
