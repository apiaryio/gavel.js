function isValidComponent(errors) {
  return errors.length === 0;
}

// Returns a boolean indicating whether a given validation result
// concludes two HTTP messages as valid (matching).
// Separated into its own util only to be used in both next and legacy API.
function isValid(validationResult) {
  return Object.values(validationResult.fields).every((resultGroup) => {
    return isValidComponent(resultGroup.errors);
  });
}

module.exports = { isValid, isValidComponent };
