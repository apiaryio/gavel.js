require '../mixins/validatable-http-message'

# HttpResponse class
#
# @author Peter Grilli <tully@apiary.io>
#
# @include validatable
class HttpResponse
  #adds validatable mixin ( {validatable} ) methods to the class
  @actAsValidatable()

  # Construct a HttpResponse
  #@option {} [Integer] statusCode
  #@option {} [String] statusMessage
  #@option {} [Object] headers
  #@option {} [String] body
  #@option {} [ExpectedHttpResponse] expected
  constructor: ({@statusCode, @statusMessage, @headers, @body, @expected}) ->

# ExpectedHttpResponse class
#
# @author Peter Grilli <tully@apiary.io>
class ExpectedHttpResponse
  # Construct a HttpResponse
  #@option {} [Integer] statusCode
  #@option {} [String] statusMessage
  #@option {} [Object] headers
  #@option {} [String] body
  #@option {} [Object] headersSchema if schema is not defined, schema is generated from headers ( {SchemaGenerator} )
  #@option {} [Object] bodySchema if schema is not defined, schema is generated from body ( {SchemaGenerator} )
  constructor: ({@statusCode, @statusMessage, @headers, @body, @headersSchema, @bodySchema}) ->

module.exports = {
  HttpResponse,
  ExpectedHttpResponse
}