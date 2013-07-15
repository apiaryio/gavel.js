require './mixins'

HttpRequest = class HttpRequest
  @actAsValidatable()
  constructor: ({@method, @uri, @headers, @body, @expected}) ->
    console.error  @uri

ExpectedHttpRequest = class ExpectedHttpRequest
  constructor: ({@method, @uri, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpRequest,
  ExpectedHttpRequest
}