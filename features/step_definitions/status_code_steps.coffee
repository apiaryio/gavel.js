util = require('util')

statusCodeStepDefs = () ->
  Given = When = Then = @.defineStep
  
  Given /^defined expected response status code "([^"]*)"$/, (code, callback) ->
    @.hit.response.defined.statusCode = code
    callback()
  
  When /^real status code is "([^"]*)"$/, (code, callback) ->
    @.hit.response.realPayload.statusCode = code
    callback()

module.exports = statusCodeStepDefs
