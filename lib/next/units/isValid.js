// Returns a boolean indicating whether a given validation result
// concludes two HTTP messages as valid (matching).
// Separated into its own util only to be used in both next and legacy API.
// TODO Move to "validateMessage" after legacy "gavel.validate()" removal.
function isValid(validationResult) {
  return Object.values(validationResult).every((resultGroup) => {
    return resultGroup.results.every((result) => result.severity !== 'error');
  });
}

module.exports = { isValid };
