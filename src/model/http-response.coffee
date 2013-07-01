require './mixins'

HttpResponse = class HttpResponse
  @actAsValidatable()

  constructor: ({@statusCode, @statusMessage, @headers, @body, @expectedHttpResponse}) ->

ExpectedHttpResponse = class ExpectedHttpResponse

  constructor: ({@statusCode, @statusMessage, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpResponse,
  ExpectedHttpResponse
}