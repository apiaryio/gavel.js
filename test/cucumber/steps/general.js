const { expect } = require('chai');
const jhp = require('json-parse-helpfulerror');

module.exports = function() {
  this.Given(
    /^I expect the following HTTP (message|request|response):$/i,
    function(_, expectedMessage) {
      this.expected = jhp.parse(expectedMessage);
    }
  );

  this.Given(/^the actual HTTP (message|request|response) equals:$/i, function(
    _,
    actualMessage
  ) {
    this.actual = jhp.parse(actualMessage);
  });

  // Inline value assertion.
  this.Given(/^the actual "([^"]*)" is "([^"]*)"/, function(fieldName, value) {
    this.actual[fieldName] = value;
  });

  this.Given(/^I expect "([^"]*)" to be "([^"]*)"$/, function(
    fieldName,
    expectedValue
  ) {
    this.expected[fieldName] = expectedValue;
  });

  this.Given(/^I expect "([^"]*)" to equal:$/, function(fieldName, codeBlock) {
    // Perform conditional code block parsing (if headers, etc.)
    this.expected[fieldName] = this.transformCodeBlock(fieldName, codeBlock);
  });

  this.Given(/^I expect "body" to match the following "([^"]*)":$/, function(
    bodyType,
    value
  ) {
    switch (bodyType.toLowerCase()) {
      case 'json schema':
        this.expected.bodySchema = value;
        break;
      default:
        this.expected.body = value;
        break;
    }
  });

  // Block value assertion.
  this.Given(/^the actual "([^"]*)" equals:$/, function(fieldName, codeBlock) {
    // Also perform conditional code parsing
    this.actual[fieldName] = this.transformCodeBlock(fieldName, codeBlock);
  });

  // Actions
  this.When('Gavel validates the HTTP message', function() {
    this.validate();
  });

  // Vocabulary proxy over the previous action for better scenarios readability.
  this.When(/^I call "([^"]*)"$/, function(_command) {
    this.validate();
  });

  // Assertions
  this.Then(/^the actual HTTP message is( NOT)? valid$/i, function(isInvalid) {
    expect(this.result).to.have.property('valid', !isInvalid);
  });

  this.Then('the validation result is:', function(expectedResult) {
    const dmp = new Diff();
    const stringifiedActual = JSON.stringify(this.result, null, 2);

    expect(this.result).to.deep.equal(
      jhp.parse(expectedResult),
      `\
Expected the following result:

${stringifiedActual}

to equal:

${expectedResult}
`
    );
  });

  this.Then(/^the "(\w+)" is( NOT)? valid$/i, function(fieldName, isInvalid) {
    expect(this.result).to.have.nested.property(
      `fields.${fieldName}.valid`,
      !isInvalid
    );
  });
};
