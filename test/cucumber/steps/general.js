const { expect } = require('chai');
const Diff = require('googlediff');
const jhp = require('json-parse-helpfulerror');

module.exports = function() {
  this.Given(
    /^you expect the following HTTP (message|request|response):$/i,
    function(_, expectedMessage) {
      this.expected = jhp.parse(expectedMessage);
    }
  );

  this.Given(/^actual HTTP (message|request|response) is:$/i, function(
    _,
    actualMessage
  ) {
    this.actual = jhp.parse(actualMessage);
  });

  this.Given(/^actual "([^"]*)" field equals "([^"]*)"/, function(
    fieldName,
    value
  ) {
    this.actual[fieldName] = value;
  });

  this.Given(/^you expect "([^"]*)" field to equal "([^"]*)"$/, function(
    fieldName,
    expectedValue
  ) {
    this.expected[fieldName] = expectedValue;
  });

  this.Given(/^you expect "([^"]*)" field to equal:$/, function(
    fieldName,
    codeBlock
  ) {
    // Perform conditional code block parsing (if headers, etc.)
    this.expected[fieldName] = this.transformCodeBlock(fieldName, codeBlock);
  });

  this.Given(
    /^you expect "body" field to match the following "([^"]*)":$/,
    function(bodyType, value) {
      switch (bodyType) {
        case 'JSON schema':
          this.expected.bodySchema = value;
          break;
        default:
          this.expected.body = value;
          break;
      }
    }
  );

  this.Given(/^actual "([^"]*)" field equals:$/, function(
    fieldName,
    codeBlock
  ) {
    // Also perform conditional code parsing
    this.actual[fieldName] = this.transformCodeBlock(fieldName, codeBlock);
  });

  // Actions
  this.When('Gavel validates HTTP message', function() {
    this.validate();
  });

  // Assertions
  this.Then(/^HTTP message is( NOT)? valid$/i, function(isInvalid) {
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

See the text diff patches below:

${dmp.patch_toText(dmp.patch_make(stringifiedActual, expectedResult))}
`
    );
  });

  this.Then(/^field "(\w+)" is( NOT)? valid$/i, function(fieldName, isInvalid) {
    expect(this.result).to.have.nested.property(
      `fields.${fieldName}.valid`,
      !isInvalid
    );
  });
};
