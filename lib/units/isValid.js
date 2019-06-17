/**
 * Concludes HTTP message's component validity based on the given
 * list of validation errors.
 * @param {Object<string, any>} errors
 * @returns {boolean}
 */
function isValidField({ errors }) {
  return errors.length === 0;
}

/**
 * Returns a boolean indicating the given validation result as valid.
 * @param {Object<string, any>} validationResult
 * @returns {boolean}
 */
function isValidResult(validationResult) {
  return Object.values(validationResult.fields).every(isValidField);
}

module.exports = {
  isValidResult,
  isValidField
};
