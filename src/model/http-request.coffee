require './mixins'

# HttpRequest class
#
# @author Peter Grilli <tully@apiary.io>
#
# @include validatable
class HttpRequest
  #adds validatable mixin ( {validatable} ) methods to the class
  @actAsValidatable()

  # Construct a HttpResponse
  #@option {} [Integer] method
  #@option {} [String] uri
  #@option {} [Object] headers
  #@option {} [String] body
  #@option {} [ExpectedHttpRequest] expected
  constructor: ({@method, @uri, @headers, @body, @expected}) ->

# ExpectedHttpRequest class
#
# @author Peter Grilli <tully@apiary.io>
class ExpectedHttpRequest
  # Construct a HttpResponse
  #@option {} [String] method
  #@option {} [String] uri
  #@option {} [Object] headers
  #@option {} [String] body
  #@option {} [Object] headersSchema if schema is not defined, schema is generated from headers ( {SchemaGenerator} )
  #@option {} [Object] bodySchema if schema is not defined, schema is generated from body ( {SchemaGenerator} )
  constructor: ({@method, @uri, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpRequest,
  ExpectedHttpRequest
}