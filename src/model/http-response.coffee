require './mixins'

HttpResponse = class HttpResponse
  @actAsValidatable()
  constructor: ({@statusCode, @statusMessage, @headers, @body, @expected}) ->

ExpectedHttpResponse = class ExpectedHttpResponse
  constructor: ({@statusCode, @statusMessage, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpResponse,
  ExpectedHttpResponse
}