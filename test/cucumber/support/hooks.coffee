
{exec} = require('child_process')


module.exports = ->
  @Before({tags: ['@cli', '@cli']}, (scenario, callback) ->
    proc = exec('mkdir /tmp/gavel-test-`date +%s`', (err, stdout, stderr) ->
      callback(new Error(err)) if err
    )
    proc.on('exit', callback)
  )

  @After({tags: ['@cli', '@cli']}, (scenario, callback) ->
    proc = exec('rm -rf /tmp/gavel-test-*', (err, stdout, stderr) ->
      callback(new Error(err)) if err
    )
    proc.on('exit', callback)
  )
