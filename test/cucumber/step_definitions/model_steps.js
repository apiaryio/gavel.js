/* eslint-disable */
const deepEqual = require('deep-equal');
const gavel = require('../../../lib/gavel');

module.exports = function() {
  // TODO consider refactoring for for better acceptace testing to separated steps
  // i.e. do not use http parsing, use separate steps for body, headers, code, etc...
  this.When(/^you have the following real HTTP request:$/, function(
    requestString,
    callback
  ) {
    this.model.request = this.parseHttp('request', requestString);
    return callback();
  });

  this.When(/^you have the following real HTTP response:$/, function(
    responseString,
    callback
  ) {
    this.model.response = this.parseHttp('response', responseString);
    return callback();
  });

  return this.Then(
    /^"([^"]*)" JSON representation will look like this:$/,
    function(objectTypeString, string, callback) {
      let data, klass;
      const expectedObject = JSON.parse(string);

      if (objectTypeString === 'HTTP Request') {
        klass = 'HttpRequest';
        data = this.model.request;
      } else if (objectTypeString === 'HTTP Response') {
        klass = 'HttpResponse';
        data = this.model.response;
      } else if (objectTypeString === 'Expected HTTP Request') {
        klass = 'ExpectedHttpRequest';
        data = this.expected;
      } else if (objectTypeString === 'Expected HTTP Response') {
        klass = 'ExpectedHttpResponse';
        data = this.expected;
      }

      const instance = new gavel[klass](data);

      const jsonizedInstance = JSON.parse(JSON.stringify(instance));

      if (!deepEqual(expectedObject, jsonizedInstance, { strict: true })) {
        callback(
          new Error(
            'Objects are not equal: ' +
              '\nexpected: \n' +
              JSON.stringify(expectedObject, null, 2) +
              '\njsonized instance: \n' +
              JSON.stringify(jsonizedInstance, null, 2)
          )
        );
      }

      return callback();
    }
  );
};
