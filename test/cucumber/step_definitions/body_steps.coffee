bodyStepDefs = () ->
  Given = When = Then = @.defineStep
  
  Given /^you define expected HTTP body using the following "([^"]*)":$/, (type, body, callback) ->
    if type == "textual example"
      @expected.body = body
    else if type == "JSON example"
      @expected.body = body
    else if type == "JSON schema"
      @expected.bodySchema = JSON.parse body

    callback()
  
  When /^real HTTP body is following:$/, (body, callback) ->
    @real.body = body
    callback()

module.exports = bodyStepDefs
