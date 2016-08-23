
module.exports = ->
  @Given /^you define expected HTTP body using the following "([^"]*)":$/, (type, body, callback) ->
    if type == 'JSON schema'
      @expected.bodySchema = JSON.parse(body)
    else
      @expected.body = body
    callback()

  @Given /^you define expected HTTP body as empty$/, (callback) ->
    @expected.body = ''
    callback()

  @Given /^real HTTP body is empty$/, (callback) ->
    @real.body = ''
    callback()

  @When /^real HTTP body is following:$/, (body, callback) ->
    @real.body = body
    callback()
