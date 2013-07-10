errors          = require './errors'

#@private
validatable = (object) ->
  object.validatableObject && object.validatableObject()

proxy = (validatableObject, method, cb) ->
  if not validatable validatableObject
    return cb new errors.NotValidatableError "Object is not validatable: #{validatableObject}"

  try
    result = validatableObject[method]()
  catch error
    return cb error, null
  return cb null, result


validate = (validatableObject, cb) ->
  proxy validatableObject, 'validate', cb

isValid = (validatableObject, cb) ->
  proxy validatableObject, 'isValid', cb

isValidatable = (validatableObject, cb) ->
  proxy validatableObject, 'isValidatable', cb

module.exports = {
  validate,
  isValid,
  isValidatable
}