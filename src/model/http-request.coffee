require './mixins'

HttpRequest = class HttpRequest
  @actAsValidatable()
  constructor: ({@method, @url, @headers, @body, @expected}) ->


ExpectedHttpRequest = class ExpectedHttpRequest
  constructor: ({@method, @url, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpRequest,
  ExpectedHttpRequest
}