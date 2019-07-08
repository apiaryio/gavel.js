const { assert } = require('chai');

module.exports = function() {
  this.Given(
    /^(I record (expected|actual) raw HTTP message:)|(a header is missing in actual message:)$/,
    function(_, __, ___, command) {
      this.commands.push(command);
    }
  );

  this.When(
    'I validate the message using the following Gavel command:',
    async function(command) {
      this.commands.push(command);
      this.status = await this.executeCommands(this.commands);
    }
  );

  this.Then(/^exit status is (\d+)$/, function(expectedStatus) {
    assert.equal(this.status, expectedStatus, 'Process statuses do not match');
  });
};
