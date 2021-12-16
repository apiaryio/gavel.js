const { defineSupportCode } = require('cucumber');
const { exec } = require('child_process');

defineSupportCode(function({ After, Before }) {
  Before({ tags: '@cli and @cli' }, function(scenarioResult, callback) {
    const proc = exec('mkdir /tmp/gavel-test-`date +%s`', function(
      err,
      stdout,
      stderr
    ) {
      if (err) {
        return callback(new Error(err));
      }
    });

    proc.on('exit', callback);
  });

  After({ tags: '@cli and @cli' }, function(scenarioResult, callback) {
    const proc = exec('rm -rf /tmp/gavel-test-*', function(
      err,
      stdout,
      stderr
    ) {
      if (err) {
        return callback(new Error(err));
      }
    });

    proc.on('exit', callback);
  });
});
