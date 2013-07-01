{Extendable} = require '../utils/extendable'
{validate }  = require './mixins'

HttpMessage = class HttpMessage extends Extendable
  @include validate

  constructor: ({@httpRequest, @httpResponse}) ->

module.exports = {
  HttpMessage
}