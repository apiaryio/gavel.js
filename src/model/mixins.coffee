{extendable} = require '../utils/extendable'

validatable =
  validate : () ->

  isValidatable : () ->

  isValid : () ->

  #@private
  getValidator: () ->

  #@private
  validateInt: () ->

  #@private
  getType: () ->

  #@private
  getValidatorByTpe: () ->






Function.prototype.actAsValidatable = () ->
  extendable.include validatable, @

