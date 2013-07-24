{exec} = require 'child_process' 

hooks = () ->
  @Before "@cli", "@cli", (callback) ->
    # prepare    
    cmd = "mkdir /tmp/gavel-test-`date +%s`"

    child = exec cmd, (error, stdout, stderr) ->
      callback.fail(error) if error

    child.on 'exit', () ->
      callback()
  
  @After "@cli", "@cli", (callback) ->
    # cleanup
    cmd = "rm -rf /tmp/gavel-test-*"
  
    child = exec cmd, (error, stdout, stderr) ->    
      callback.fail(error) if error

    child.on 'exit', () ->
      callback()

  
module.exports = hooks