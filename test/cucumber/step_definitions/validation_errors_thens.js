/* eslint-disable */
const { assert } = require('chai');

module.exports = function() {
  this.Then(/^Gavel will set some error for "([^"]*)"$/, function(
    rawComponentName,
    callback
  ) {
    try {
      const result = this.validate();
      const component = this.toCamelCase(rawComponentName);
      const componentValidation = result.fields[component];
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
    } catch (error) {
      callback(new Error(`Error during validation: ${error}`));
    }
  });

  this.Then(/^Gavel will NOT set any errors for "([^"]*)"$/, function(
    rawComponentName,
    callback
  ) {
    try {
      const result = this.validate();
      const component = this.toCamelCase(rawComponentName);
      const componentValidation = result.fields[component];
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
    } catch (error) {
      callback(new Error(`Error during validation: ${error}`));
    }
  });

  this.Then(/^field "([^"]*)" is( NOT)? valid$/, function(
    fieldName,
    isNotValid,
    callback
  ) {
    const result = this.validate();
    assert.property(
      result.fields,
      fieldName,
      `Expected to have "${fieldName}" field in the validation result, but got none.`
    );

    assert.propertyVal(
      result.fields[fieldName],
      'isValid',
      !isNotValid,
      `Expected "result.fields.${fieldName}" to be valid, but it's not.`
    );

    return callback();
  });

  this.Then(/^Request or Response is NOT valid$/, function(callback) {
    const result = this.validate();
    if (result.isValid) {
      callback(
        new Error('Request or Response is valid and should NOT be valid.')
      );
    }
    return callback();
  });

  return this.Then(/^Request or Response is valid$/, function(callback) {
    const result = this.validate();
    if (!result.isValid) {
      callback(
        new Error('Request or Response is NOT valid and should be valid.')
      );
    }
    return callback();
  });
};
