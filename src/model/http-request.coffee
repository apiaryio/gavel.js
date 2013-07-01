{Extendable} = require '../utils/extendable'
{validate}  = require './mixins'

HttpRequest = class HttpRequest extends Extendable
  @include validate

  constructor: ({@method, @url, @headers, @body, @expectedHttpRequest}) ->



ExpectedHttpRequest = class ExpectedHttpRequest

  constructor: ({@method, @url, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpRequest,
  ExpectedHttpRequest
}