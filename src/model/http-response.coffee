{Validatable} = require '../mixins/validatable-http-message'
clone = require 'clone'

# HttpResponse class
#
# @author Peter Grilli <tully@apiary.io>
class HttpResponse extends Validatable
  resourcesKeys: ['statusCode', 'statusMessage', 'headers', 'body', 'expected']
  # Construct a HttpResponse
  #@option {} [Integer] statusCode
  #@option {} [String] statusMessage
  #@option {} [Object] headers
  #@option {} [String] body
  #@option {} [ExpectedHttpResponse] expected
  constructor: (resources = {}) ->
    for resourceKey in @resourcesKeys
      @[resourceKey] = clone resources[resourceKey], false
    super()

# ExpectedHttpResponse class
#
# @author Peter Grilli <tully@apiary.io>
class ExpectedHttpResponse
  resourcesKeys: ['statusCode', 'statusMessage', 'headers', 'body', 'headersSchema', 'bodySchema']
  # Construct a HttpResponse
  #@option {} [Integer] statusCode
  #@option {} [String] statusMessage
  #@option {} [Object] headers
  #@option {} [String] body
  #@option {} [Object] headersSchema if schema is not defined, schema is generated from headers ( {SchemaGenerator} )
  #@option {} [Object] bodySchema if schema is not defined, schema is generated from body ( {SchemaGenerator} )
  constructor: (resources = {}) ->
    for resourceKey in @resourcesKeys
      @[resourceKey] = clone resources[resourceKey], false

module.exports = {
  HttpResponse,
  ExpectedHttpResponse
}