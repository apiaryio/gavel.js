/* eslint-disable */
const { assert } = require('chai');

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
      const componentValidation = result.field[component];
      const { errors } = componentValidation;
      const errorsCount = errors.length;

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
      const componentValidation = result.field[component];
      const { errors } = componentValidation;
      const errorsCount = errors.length;

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

  this.Then(/^Gavel will set "([^"]*)" to "([^"]*)" for "([^"]*)"$/, function(
    propName,
    expectedValue,
    componentName,
    callback
  ) {
    return this.validate((error, result) => {
      console.log({ componentName, propName, expectedValue });
      console.log({ result });

      assert.property(
        result.field,
        componentName,
        `Expected validation result to have property "${componentName}", but got "${Object.keys(
          result
        ).join('", "')}"`
      );

      assert.propertyVal(
        result.field[componentName],
        propName,
        this.toBoolean(expectedValue)
      );

      return callback();
    });
  });

  this.Then(/^Request or Response is NOT valid$/, function(callback) {
    return this.validate((error, result) => {
      if (result.isValid) {
        callback(
          new Error('Request or Response is valid and should NOT be valid.')
        );
      }
      return callback();
    });
  });

  return this.Then(/^Request or Response is valid$/, function(callback) {
    return this.validate((error, result) => {
      if (!result.isValid) {
        callback(
          new Error('Request or Response is NOT valid and should be valid.')
        );
      }
      return callback();
    });
  });
};
