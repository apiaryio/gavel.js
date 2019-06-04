function isValidComponent(errors) {
  return errors.every((error) => error.severity !== 'error');
}

// Returns a boolean indicating whether a given validation result
// concludes two HTTP messages as valid (matching).
// Separated into its own util only to be used in both next and legacy API.
function isValid(validationResult) {
  return Object.values(validationResult.field).every((resultGroup) => {
    return isValidComponent(resultGroup.errors);
  });
}

module.exports = { isValid, isValidComponent };
