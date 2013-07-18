errors          = require './errors'

#@private
validatable = (object) ->
  object.validatableObject && object.validatableObject()

#@private
proxy = (validatableObject, method, cb) ->
  if not validatable validatableObject
    return cb new errors.NotValidatableError "Object is not validatable: #{validatableObject}"

  try
    result = validatableObject[method]()
  catch error
    return cb error, null
  return cb null, result

#asynchronous wrapper for validatableObject ({HttpMessage}, {HttpRequest}, {HttpResponse}) - validate method
validate = (validatableObject, cb) ->
  proxy validatableObject, 'validate', cb

#asynchronous wrapper for validatableObject ({HttpMessage}, {HttpRequest}, {HttpResponse}) - isValid method
isValid = (validatableObject, cb) ->
  proxy validatableObject, 'isValid', cb

#asynchronous wrapper for validatableObject ({HttpMessage}, {HttpRequest}, {HttpResponse}) - isValidatable method
isValidatable = (validatableObject, cb) ->
  proxy validatableObject, 'isValidatable', cb

module.exports = {
  validate,
  isValid,
  isValidatable
}