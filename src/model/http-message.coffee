{Extendable} = require '../utils/extendable'
{validate, isValidatable, isValid}  = require './mixins'

HttpMessage = class HttpMessage extends Extendable

  constructor: ({@httpRequest, @httpResponse}) ->

module.exports = {
  HttpMessage
}