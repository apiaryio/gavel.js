javascriptStepDefs = () ->
  Given = When = Then = @.defineStep

  Given /^you define the following "([^"]*)" variable:$/, (arg1, string, callback) ->
    @codeBuffer += string + "\n"
    callback()
  
  Given /^you define following "([^"]*)" object:$/, (objectName, string, callback) ->
    @codeBuffer += string + "\n"
    callback()
  
  Given /^you add expected "([^"]*)" to real "([^"]*)":$/, (arg1, arg2, string, callback) ->
    @codeBuffer += string + "\n"
    callback()

  Given /^prepare result variable:$/, (string, callback) ->
    @codeBuffer += string + "\n"
    callback()

  Then /^"([^"]*)" variable will contain:$/, (varName, string, callback) -> 
    @codeBuffer += varName + "\n"
    expected = string
    @expectBlockEval @codeBuffer, expected, callback

  When /^you call:$/, (string, callback) ->
    @codeBuffer += string + "\n"
    callback()

  Then /^it will return:$/, (expected, callback) ->
    @expectBlockEval @codeBuffer, expected, callback

module.exports = javascriptStepDefs
