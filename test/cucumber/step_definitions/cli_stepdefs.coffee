{exec} = require 'child_process' 
cliStepDefs = () ->
  Given = When = Then = @.defineStep
  

  Given /^you record expected raw HTTP messages:$/, (cmd, callback) ->
    @commandBuffer += ";" + cmd 
    callback()

  Given /^you record real raw HTTP messages:$/, (cmd, callback) ->
    @commandBuffer += ";" + cmd 
    callback()

  When /^you validate the message using the following Gavel command:$/, (cmd, callback) ->
    @commandBuffer += ";" + cmd 
    callback()

  When /^a header is missing in real messages:$/, (cmd, callback) ->
    @commandBuffer += ";" + cmd 
    callback()

  Then /^exit status is (\d+)$/, (expectedExitStatus, callback) ->
    cmd = "PATH=$PATH:" + process.cwd() + "/bin; cd /tmp/gavel-* " + @commandBuffer 
    child = exec cmd, (error, stdout, stderr) ->
      if error
        unless parseInt(error.code) == parseInt(expectedExitStatus)
          callback.fail 'Expected exit status ' + expectedExitStatus + ' but got ' + error.code + '.' + \
            "STDERR: " + stderr + \
            "STDOUT: " + stdout

      
    child.on 'exit', (code) ->
      unless parseInt(code) == parseInt(expectedExitStatus)
       callback.fail 'Expected exit status ' + expectedExitStatus + ' but got ' + code + '.'
      callback()


module.exports = cliStepDefs
