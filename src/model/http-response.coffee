{extendable}                        = require '../utils/extendable'
{validate}  = require './mixins'

HttpResponse = class HttpResponse
  extendable.include validate, @

  constructor: ({@statusCode, @statusMessage, @headers, @body, @expectedHttpResponse}) ->

ExpectedHttpResponse = class ExpectedHttpResponse

  constructor: ({@statusCode, @statusMessage, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpResponse,
  ExpectedHttpResponse
}