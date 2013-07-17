require './mixins'

# @include validatable
class HttpResponse
  @actAsValidatable()
  constructor: ({@statusCode, @statusMessage, @headers, @body, @expected}) ->

class ExpectedHttpResponse
  constructor: ({@statusCode, @statusMessage, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpResponse,
  ExpectedHttpResponse
}