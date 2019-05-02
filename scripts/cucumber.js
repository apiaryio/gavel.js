const spawn = require('cross-spawn');

const isWindows = process.platform.match(/^win/);

// Removing '@cli' behavior from tests due to
// https://github.com/apiaryio/gavel-spec/issues/24
const tags = [
  '@javascript',
  '~@proposal',
  '~@draft',
  '~@javascript-pending',
  isWindows && '~@cli'
].filter(Boolean);

const args = tags.reduce((acc, tag) => {
  return acc.concat('-t').concat(tag);
}, []);

const cucumber = spawn(
  'node_modules/.bin/cucumber-js',
  args.concat([
    '-r',
    'test/cucumber/support/',
    '-r',
    'test/cucumber/step_definitions/',
    '-f',
    'pretty',
    'node_modules/gavel-spec/features/'
  ])
);

cucumber.stdout.on('data', (data) => process.stdout.write(data));
cucumber.stderr.on('data', (data) => process.stderr.write(data));

cucumber.on('error', (err) => {
  console.error(err);
  process.exit(1);
});

cucumber.on('close', (code) => process.exit(code));
