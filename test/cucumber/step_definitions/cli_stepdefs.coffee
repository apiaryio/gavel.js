{exec} = require 'child_process' 
cliStepDefs = () ->
  Given = When = Then = @.defineStep
  

  Given /^you record expected raw HTTP messages:$/, (cmd, callback) ->

    callback()

  Given /^you record real raw HTTP message:$/, (cmd, callback) ->

    callback()

  When /^you validate messages using following Gavel command:$/, (cmd, callback) ->
    @commandBuffer += ";" + cmd 
    callback()

  When /^there is some header missing in real messages:$/, (cmd, callback) ->
    @commandBuffer += ";" + cmd 
    callback()

  Then /^exit status is (\d+)$/, (expectedExitStatus, callback) ->

    cmd = "PATH=$PATH:" + process.cwd() + "/bin; cd ./test/fixtures " + @commandBuffer 
    console.error cmd    
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
