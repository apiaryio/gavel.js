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

    console.log('expected:\n', JSON.stringify(expected, null, 2));
    console.log('actual:\n', JSON.stringify(actual, null, 2));

    expect(actual).to.deep.equal(expected);
  });
};
