util = require('util')

bodyStepDefs = () ->
  Given = When = Then = @.defineStep
  
  Given /^expected HTTP body is defined by following "([^"]*)":$/, (type, body, callback) ->
    if type == "textual example" or type == "JSON example"
      @.hit.response.defined.body = body
    else if type == "JSON schema"
      @.hit.response.defined.userSchemas.push(body)

    callback()
  
  When /^real HTTP body is following:$/, (body, callback) ->
    @.hit.response.realPayload.body = body
    callback()

module.exports = bodyStepDefs
