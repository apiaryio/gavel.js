{Validatable} = require '../mixins/validatable-http-message'
clone = require 'clone'

# HttpRequest class
#
# @author Peter Grilli <tully@apiary.io>
class HttpRequest extends Validatable
  resourcesKeys: ['method', 'uri', 'headers', 'body', 'expected']
  # Construct a HttpResponse
  #@option {} [String] method
  #@option {} [String] uri
  #@option {} [Object] headers
  #@option {} [String] body
  #@option {} [ExpectedHttpRequest] expected
  constructor: (resources = {}) ->
    for resourceKey in @resourcesKeys
      @[resourceKey] = clone resources[resourceKey], false
    super()

# ExpectedHttpRequest class
#
# @author Peter Grilli <tully@apiary.io>
class ExpectedHttpRequest
  resourcesKeys: ['method', 'uri', 'headers', 'body', 'headersSchema', 'bodySchema']
  # Construct a HttpResponse
  #@option {} [String] method
  #@option {} [String] uri
  #@option {} [Object] headers
  #@option {} [String] body
  #@option {} [Object] headersSchema if schema is not defined, schema is generated from headers ( {SchemaGenerator} )
  #@option {} [Object] bodySchema if schema is not defined, schema is generated from body ( {SchemaGenerator} )
  constructor: (resources = {}) ->
    for resourceKey in @resourcesKeys
      @[resourceKey] = clone resources[resourceKey], false

module.exports = {
  HttpRequest,
  ExpectedHttpRequest
}