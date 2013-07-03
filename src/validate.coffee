errors          = require './errors'

#@private
validatable = (object) ->
  object.validatableObject && object.validatableObject()

proxy = (validatableObject, method) ->
  if not validatable validatableObject
    throw new errors.NotValidatableError "Object is not validatable: #{validatableObject}"

  return validatableObject[method]()


validate = (validatableObject) ->
  proxy validatableObject, 'validate'

isValid = (validatableObject) ->
  proxy validatableObject, 'isValid'

isValidatable = (validatableObject) ->
  proxy validatableObject, 'isValidatable'

module.exports = {
  validate,
  isValid,
  isValidatable

}