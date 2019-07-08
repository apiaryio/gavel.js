const { exec } = require('child_process');

module.exports = function() {
  this.Given(/^you record expected raw HTTP messages:$/, function(
    cmd,
    callback
  ) {
    this.commandBuffer += `;${cmd}`;
    return callback();
  });

  this.Given(/^you record real raw HTTP messages:$/, function(cmd, callback) {
    this.commandBuffer += `;${cmd}`;
    return callback();
  });

  this.When(
    /^you validate the message using the following Gavel command:$/,
    function(cmd, callback) {
      this.commandBuffer += `;${cmd}`;
      return callback();
    }
  );

  this.When(/^a header is missing in real messages:$/, function(cmd, callback) {
    this.commandBuffer += `;${cmd}`;
    return callback();
  });

  return this.Then(/^exit status is (\d+)$/, function(
    expectedExitStatus,
    callback
  ) {
    const cmd = `PATH=$PATH:${process.cwd()}/bin:${process.cwd()}/node_modules/.bin; cd /tmp/gavel-* ${
      this.commandBuffer
    }`;
    const child = exec(cmd, function(error, stdout, stderr) {
      if (error) {
        if (parseInt(error.code) !== parseInt(expectedExitStatus)) {
          return callback(
            new Error(
              `Expected exit status ${expectedExitStatus} but got ${
                error.code
              }.` +
                'STDERR: ' +
                stderr +
                'STDOUT: ' +
                stdout
            )
          );
        }

        return callback();
      }
    });

    return child.on('exit', function(code) {
      if (parseInt(code) !== parseInt(expectedExitStatus)) {
        callback(
          new Error(
            `Expected exit status ${expectedExitStatus} but got ${code}.`
          )
        );
      }
      return callback();
    });
  });
};