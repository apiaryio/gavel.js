{Extendable}                        = require '../utils/extendable'
{validate}  = require './mixins'

HttpResponse = class HttpResponse extends Extendable
  @include validate

  constructor: ({@statusCode, @statusMessage, @headers, @body, @expectedHttpResponse}) ->

ExpectedHttpResponse = class ExpectedHttpResponse

  constructor: ({@statusCode, @statusMessage, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpResponse,
  ExpectedHttpResponse
}