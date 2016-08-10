
util = require('util')


module.exports = ->
  @Given /^you expect HTTP status code "([^"]*)"$/, (code, callback) ->
    @expected.statusCode = code
    callback()

  @When /^real status code is "([^"]*)"$/, (code, callback) ->
    @real.statusCode = code
    callback()
