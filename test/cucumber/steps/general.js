const { defineSupportCode } = require('cucumber');
const { expect } = require('chai');
const parseJson = require('../../../lib/utils/parseJson');

defineSupportCode(function({ Then, When, Given }) {
  Given(/^I expect the following HTTP (message|request|response):$/i, function(
    _,
    expectedMessage
  ) {
    this.expected = parseJson(expectedMessage);
  });

  Given(/^the actual HTTP (message|request|response) equals:$/i, function(
    _,
    actualMessage
  ) {
    this.actual = parseJson(actualMessage);
  });

  // Inline value assertion.
  Given(/^the actual "([^"]*)" is "([^"]*)"/, function(fieldName, value) {
    this.actual[fieldName] = value;
  });

  Given(/^I expect "([^"]*)" to be "([^"]*)"$/, function(
    fieldName,
    expectedValue
  ) {
    this.expected[fieldName] = expectedValue;
  });

  Given(/^I expect "([^"]*)" to equal:$/, function(fieldName, codeBlock) {
    // Perform conditional code block parsing (if headers, etc.)
    this.expected[fieldName] = this.transformCodeBlock(fieldName, codeBlock);
  });

  Given(/^I expect "body" to match the following "([^"]*)":$/, function(
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
  Given(/^the actual "([^"]*)" equals:$/, function(fieldName, codeBlock) {
    // Also perform conditional code parsing
    this.actual[fieldName] = this.transformCodeBlock(fieldName, codeBlock);
  });

  // Actions
  When('Gavel validates the HTTP message', function() {
    this.validate();
  });

  // Vocabulary proxy over the previous action for better scenarios readability.
  When(/^I call "gavel.validate(([^"]*))"$/, function(_command) {
    this.validate();
  });

  // Assertions
  Then(/^the actual HTTP message is( NOT)? valid$/i, function(isInvalid) {
    expect(this.result).to.have.property('valid', !isInvalid);
  });

  Then('the validation result is:', function(expectedResult) {
    const stringifiedActual = JSON.stringify(this.result, null, 2);

    expect(this.result).to.deep.equal(
      parseJson(expectedResult),
      `\
Expected the following result:

${stringifiedActual}

to equal:

${expectedResult}
`
    );
  });

  Then(/^the "(\w+)" is( NOT)? valid$/i, function(fieldName, isInvalid) {
    expect(this.result).to.have.nested.property(
      `fields.${fieldName}.valid`,
      !isInvalid
    );
  });
});
