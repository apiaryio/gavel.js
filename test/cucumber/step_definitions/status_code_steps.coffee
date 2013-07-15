util = require('util')

statusCodeStepDefs = () ->
  Given = When = Then = @.defineStep
  
  Given /^you expect HTTP status code "([^"]*)"$/, (code, callback) ->
    @expected.statusCode = code
    callback()
  
  When /^real status code is "([^"]*)"$/, (code, callback) ->
    @expected.statusCode = code
    callback()

module.exports = statusCodeStepDefs
