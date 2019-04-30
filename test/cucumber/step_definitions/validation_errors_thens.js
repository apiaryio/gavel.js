module.exports = function() {
  this.Then(/^Gavel will set some error for "([^"]*)"$/, function(
    component,
    callback
  ) {
    return this.validate((error, result) => {
      if (error) {
        callback(new Error(`Error during validation: ${error}`));
      }

      component = this.toCamelCase(component);
      const componentValidation = result[component];
      const results = componentValidation['results'];
      const errorsCount = results.length;

      if (!errorsCount > 0) {
        callback(
          new Error(
            `Expected validation errors on '${component}', but there are no validation errors.`
          )
        );
      }

      return callback();
    });
  });

  this.Then(/^Gavel will NOT set any errors for "([^"]*)"$/, function(
    component,
    callback
  ) {
    return this.validate((error, result) => {
      if (error) {
        callback(new Error(`Error during validation: ${error}`));
      }
      component = this.toCamelCase(component);
      const componentValidation = result[component];
      const results = componentValidation['results'];
      const errorsCount = results.length;

      if (errorsCount > 0) {
        callback(
          new Error(
            "No errors on '" +
              component +
              "' expected, but there are " +
              errorsCount +
              ' validation errors:' +
              JSON.stringify(results, null, 2)
          )
        );
      }

      return callback();
    });
  });

  this.Then(/^Request or Response is NOT valid$/, function(callback) {
    return this.isValid((error, result) => {
      if (result) {
        callback(
          new Error('Request or Response is valid and should NOT be valid.')
        );
      }
      return callback();
    });
  });

  return this.Then(/^Request or Response is valid$/, function(callback) {
    return this.isValid((error, result) => {
      if (!result) {
        callback(
          new Error('Request or Response is NOT valid and should be valid.')
        );
      }
      return callback();
    });
  });
};
