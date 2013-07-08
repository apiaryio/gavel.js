_ = require 'lodash'
vm = require 'vm'
util = require 'util'

javascriptStepDefs = () ->
  Given = When = Then = @.defineStep
  
  Given /^defined "([^"]*)" object:$/, (objectName, string, callback) ->
    @.codeBuffer += string + "\n"
    callback()
  
  When /^I call:$/, (string, callback) ->
    @.codeBuffer += string + "\n"
    callback()

  Then /^it should return:$/, (expected, callback) ->
    realOutput = safeEval(@.codeBuffer,callback)

    # I'm terribly sorry, but curly braces not asigned to any
    # variable in evaled string are interpreted as code block
    # not an Object literal, so I'm wrapping expected code output
    # with brackets. 
    # see: http://stackoverflow.com/questions/8949274/javascript-calling-eval-on-an-object-literal-with-functions

    expectedOutput = safeEval("(" + expected + ")",callback)

    realOutputInspect = util.inspect(realOutput)
    expectedOutputInspect = util.inspect(expectedOutput)
    
    if not _.isEqual(realOutput, expectedOutput)
      callback.fail "Output of code buffer does not equal. Expected output:\n" \
                    + expectedOutputInspect \
                    + "\n but got: \n" \
                    + realOutputInspect

    callback()

  safeEval = (code,callback) ->
    
    # I'm terribly sorry, it's no longer possible to manipulate module require/load 
    # path inside node's process. So I'm prefixing require path by hard 
    # substitution in code to pretend to 'hit' is packaged module.
    # 
    # further reading on node.js load paths:
    # http://nodejs.org/docs/v0.8.23/api/all.html#all_all_together

    code = code.replace("require('","require('../../../src/")

    try  
      return eval(code)
    catch error
      callback.fail "Eval failed. Code buffer: \n\n" \
                    + code \
                    + "\nWith error: " \
                    + error
    

module.exports = javascriptStepDefs
