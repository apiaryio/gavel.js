const chai = require('chai');
const parseJson = require('../../../lib/utils/parseJson');

chai.config.truncateThreshold = 0;
const { expect } = chai;

module.exports = function() {
  this.Then(/^the result field "([^"]*)" equals:$/, function(
    fieldName,
    expectedJson
  ) {
    const actual = this.result.fields[fieldName];
    const expected = parseJson(expectedJson);

    expect(actual).to.deep.equal(expected);
  });
};
