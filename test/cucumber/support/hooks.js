const { exec } = require('child_process');

module.exports = function() {
  this.Before({ tags: ['@cli', '@cli'] }, function(scenario, callback) {
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

  return this.After({ tags: ['@cli', '@cli'] }, function(scenario, callback) {
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
};
