
spawn = require('cross-spawn')


IS_WINDOWS = process.platform.match(/^win/)


# Removing '@cli' behavior from tests due to
# https://github.com/apiaryio/gavel-spec/issues/24
tags = ['@javascript', '~@proposal', '~@draft', '~@javascript-pending']
tags.push('~@cli') if process.platform.match(/^win/)


args = []
for tag in tags
  args.push('-t')
  args.push(tag)


cucumber = spawn('node_modules/.bin/cucumber-js', args.concat([
  '-r', 'test/cucumber/support/',
  '-r', 'test/cucumber/step_definitions/',
  '-f', 'pretty',
  '--compiler=coffee:coffee-script/register',
  'node_modules/gavel-spec/features/',
]))

cucumber.stdout.on('data', (data) -> process.stdout.write(data))
cucumber.stderr.on('data', (data) -> process.stderr.write(data))

cucumber.on('error', (err) ->
  console.error(err)
  process.exit(1)
)

cucumber.on('close', (code) -> process.exit(code))
