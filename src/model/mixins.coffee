{extendable} = require '../utils/extendable'

validate =
  validate : () ->
    console.error @a

  isValidatable : () ->

  isValid : () ->


Function.prototype.actAsValidatable = () ->
  extendable.include validate, @

