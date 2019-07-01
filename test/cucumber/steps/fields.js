const chai = require('chai');
const jhp = require('json-parse-helpfulerror');

chai.config.truncateThreshold = 0;
const { expect } = chai;

module.exports = function() {
  this.Then(/^field "([^"]*)" equals:$/, function(fieldName, expectedJson) {
    const expected = jhp.parse(expectedJson);

    expect(this.result.fields[fieldName]).to.deep.equal(expected);
  });
};
