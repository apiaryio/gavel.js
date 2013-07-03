require './mixins'

HttpMessage = class HttpMessage
  @actAsValidatableMessage()
  constructor: ({@httpRequest, @httpResponse}) ->


module.exports = {
  HttpMessage
}