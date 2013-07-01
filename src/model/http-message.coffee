require './mixins'

HttpMessage = class HttpMessage
  @actAsValidatable()

  constructor: ({@httpRequest, @httpResponse}) ->


module.exports = {
  HttpMessage
}