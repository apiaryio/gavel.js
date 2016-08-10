
module.exports = ->
  @Given /^you expect the following HTTP headers:$/, (string, callback) ->
    @expected.headers = @parseHeaders(string)
    callback()

  @When /^real HTTP headers are following:$/, (string, callback) ->
    @real.headers = @parseHeaders(string)
    callback()
