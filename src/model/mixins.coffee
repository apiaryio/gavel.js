{extendable} = require '../utils/extendable'

validate =
  validate : () ->

  isValidatable : () ->

  isValid : () ->

actAsValidatable = (self) ->
  extendable.include validate, self

module.exports = {
  actAsValidatable
}