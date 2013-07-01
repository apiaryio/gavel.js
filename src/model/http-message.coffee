{extendable} = require '../utils/extendable'
{validate }  = require './mixins'

HttpMessage = class HttpMessage
  extendable.include validate, @

  constructor: ({@httpRequest, @httpResponse}) ->

module.exports = {
  HttpMessage
}