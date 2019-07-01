/* eslint-disable */
const tv4 = require('tv4');
const { assert } = require('chai');
const deepEqual = require('deep-equal');

module.exports = function() {
  this.When(
    /^you perform a failing validation on any validatable HTTP component$/,
    function(callback) {
      const json1 = '{"a": "b"}';
      const json2 = '{"c": "d"}';

      this.component = 'body';

      this.real = {
        headers: {
          'content-type': 'application/json'
        },
        body: json1
      };

      this.expected = {
        headers: {
          'content-type': 'application/json'
        },
        body: json2
      };

      try {
        const result = this.validate();
        this.results = JSON.parse(JSON.stringify(result));
        return callback();
      } catch (error) {
        callback(new Error(`Got error during validation:\n${error}`));
      }
    }
  );

  this.Then(
    /^the validator output for the HTTP component looks like the following JSON:$/,
    function(expectedJson, callback) {
      const expected = JSON.parse(expectedJson);
      const real = this.results.fields[this.component];
      if (!deepEqual(real, expected, { strict: true })) {
        return callback(
          new Error(
            'Not matched! Expected:\n' +
              JSON.stringify(expected, null, 2) +
              '\n' +
              'But got:' +
              '\n' +
              JSON.stringify(real, null, 2)
          )
        );
      } else {
        return callback();
      }
    }
  );

  this.Then(/^validated HTTP component is considered invalid$/, function(
    callback
  ) {
    assert.isFalse(this.booleanResult);
    return callback();
  });

  this.Then(
    /^the validator output for the HTTP component is valid against "([^"]*)" model JSON schema:$/,
    function(model, schema, callback) {
      const valid = tv4.validate(
        this.results.fields[this.component],
        JSON.parse(schema)
      );
      if (!valid) {
        return callback(
          new Error(
            'Expected no validation errors on schema but got:\n' +
              JSON.stringify(tv4.error, null, 2)
          )
        );
      } else {
        return callback();
      }
    }
  );

  this.Then(
    /^each result entry under "([^"]*)" key must contain "([^"]*)" key$/,
    function(key1, key2, callback) {
      const error = this.results.fields[this.component];
      if (error === undefined) {
        callback(
          new Error(
            'Validation result for "' +
              this.component +
              '" is undefined. Validations: ' +
              JSON.stringify(this.results, null, 2)
          )
        );
      }

      error[key1].forEach((error) => assert.include(Object.keys(error), key2));
      return callback();
    }
  );

  this.Then(
    /^the output JSON contains key "([^"]*)" with one of the following values:$/,
    function(key, table, callback) {
      const error = this.results.fields[this.component];

      const validators = [].concat.apply([], table.raw());

      assert.include(validators, error[key]);
      return callback();
    }
  );

  this.Given(/^you want validate "([^"]*)" HTTP component$/, function(
    component,
    callback
  ) {
    this.component = component;
    return callback();
  });

  this.Given(
    /^you express expected data by the following "([^"]*)" example:$/,
    function(type, data, callback) {
      if (type === 'application/schema+json') {
        this.expected['bodySchema'] = data;
      } else if (type === 'application/vnd.apiary.http-headers+json') {
        this.expected[this.component] = JSON.parse(data);
      } else {
        this.expected[this.component] = data;
      }

      this.expectedType = type;
      return callback();
    }
  );

  this.Given(/^you have the following "([^"]*)" real data:$/, function(
    type,
    data,
    callback
  ) {
    if (type === 'application/vnd.apiary.http-headers+json') {
      this.real[this.component] = JSON.parse(data);
    } else {
      this.real[this.component] = data;
    }

    this.realType = type;
    return callback();
  });

  this.When(/^you perform validation on the HTTP component$/, function(
    callback
  ) {
    try {
      const result = this.validate();
      this.results = result;
      this.componentResults = this.results.fields[this.component];
      return callback();
    } catch (error) {
      callback(new Error(`Error during validation: ${error}`));
    }
  });

  this.Then(
    /^validation key "([^"]*)" looks like the following "([^"]*)":$/,
    function(key, type, expected, callback) {
      const real = this.componentResults[key];
      if (type === 'JSON') {
        expected = JSON.parse(expected);
      } else if (type === 'text') {
        // FIXME investigate how does cucumber docstrings handle
        // newlines and remove trim and remove this hack
        expected = expected + '\n';
      }

      if (type === 'JSON') {
        if (!deepEqual(expected, real, { strict: true })) {
          callback(
            new Error(
              'Not matched! Expected:\n' +
                this.inspect(expected) +
                '\n' +
                'But got:' +
                '\n' +
                this.inspect(real) +
                '\n' +
                'End'
            )
          );
        }
      } else if (type === 'text') {
        assert.equal(expected, real);
      }
      return callback();
    }
  );

  return this.Then(/^each result entry must contain "([^"]*)" key$/, function(
    key,
    callback
  ) {
    this.componentResults.errors.forEach((error) =>
      assert.include(Object.keys(error), key)
    );
    return callback();
  });
};
