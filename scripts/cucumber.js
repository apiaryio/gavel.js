/* eslint-disable import/no-extraneous-dependencies */
const spawn = require('cross-spawn');

const isWindows = process.platform.match(/^win/);

// Excludes Cucumber features marked with the "@cli" tag.
// CLI does not work on Windows:
// https://github.com/apiaryio/gavel-spec/issues/24
const tags = [isWindows && '-t ~@cli'].filter(Boolean);

const args = [
  ...tags,
  '-r',
  'test/cucumber/support/',
  '-r',
  'test/cucumber/steps/',
  '-f',
  'pretty',
  'node_modules/gavel-spec/features/'
];

const cucumber = spawn('node_modules/.bin/cucumber-js', args);

cucumber.stdout.on('data', (data) => process.stdout.write(data));
cucumber.stderr.on('data', (data) => process.stderr.write(data));

cucumber.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

cucumber.on('close', (code) => process.exit(code));
