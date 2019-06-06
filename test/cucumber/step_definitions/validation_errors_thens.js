const { assert } = require('chai');

module.exports = function() {
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
