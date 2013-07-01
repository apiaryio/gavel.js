{extendable} = require '../utils/extendable'
{validate}  = require './mixins'

HttpRequest = class HttpRequest
  extendable.include validate, @

  constructor: ({@method, @url, @headers, @body, @expectedHttpRequest}) ->



ExpectedHttpRequest = class ExpectedHttpRequest

  constructor: ({@method, @url, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpRequest,
  ExpectedHttpRequest
}