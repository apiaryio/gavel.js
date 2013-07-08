util = require('util')

bodyStepDefs = () ->
  Given = When = Then = @.defineStep
  
  Given /^expected HTTP body is defined by following "([^"]*)":$/, (type, body, callback) ->
    if type == "textual example" or type == "JSON example"
      @.hit.response.expected.body = body
    else if type == "JSON schema"
      @.hit.response.expected.schema.body = body

    callback()
  
  When /^real HTTP body is following:$/, (body, callback) ->
    @.hit.response.real.body = body
    callback()

module.exports = bodyStepDefs
