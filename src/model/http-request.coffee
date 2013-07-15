require './mixins'

HttpRequest = class HttpRequest
  @actAsValidatable()
  constructor: ({@method, @uri, @headers, @body, @expected}) ->

ExpectedHttpRequest = class ExpectedHttpRequest
  constructor: ({@method, @uri, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpRequest,
  ExpectedHttpRequest
}