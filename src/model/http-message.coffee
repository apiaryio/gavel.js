require './mixins'

# @include validatableMessage
class HttpMessage
  @actAsValidatableMessage()
  constructor: ({@httpRequest, @httpResponse}) ->


module.exports = {
  HttpMessage
}