const { assert } = require('chai');

module.exports = function() {
  this.Given(
    /^(I record (expected|actual) raw HTTP message:)|(a header is missing in actual message:)$/,
    function(_1, _2, _3, command) {
      this.commands.push(command);
    }
  );

  this.When(
    'I validate the message using the following Gavel command:',
    async function(command) {
      this.commands.push(command);
      this.exitCode = await this.executeCommands(this.commands);
    }
  );

  this.Then(/^exit status is (\d+)$/, function(expectedExitCode) {
    assert.equal(
      this.exitCode,
      expectedExitCode,
      `Expected process to exit with code ${expectedExitCode}, but got ${this.exitCode}.`
    );
  });
};
