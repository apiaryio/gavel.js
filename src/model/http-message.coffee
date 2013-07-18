require './mixins'

# HttpMessage class
#
# @author Peter Grilli <tully@apiary.io>
#
# @include validatableMessage
class HttpMessage
  #adds validatableMessage mixin ( {validatableMessage} ) methods to the class
  @actAsValidatableMessage()

  # Construct a HttpMessage
  #@option {} [HttpRequest] httpRequest
  #@option {} [HttpResponse] httpResponse
  constructor: ({@httpRequest, @httpResponse}) ->

module.exports = {
  HttpMessage
}