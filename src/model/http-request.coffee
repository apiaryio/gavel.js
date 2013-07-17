require './mixins'

# This class has a virtual method, that doesn't
# exist in the source but appears in the documentation.
# @include validatable
class HttpRequest
  @actAsValidatable()
  constructor: ({@method, @uri, @headers, @body, @expected}) ->

class ExpectedHttpRequest
  constructor: ({@method, @uri, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpRequest,
  ExpectedHttpRequest
}