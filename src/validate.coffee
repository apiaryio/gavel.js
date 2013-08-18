errors          = require './errors'

{HttpRequest, ExpectedHttpRequest} = require('./model/http-request')
{HttpResponse, ExpectedHttpResponse} = require('./model/http-response')

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

#asynchronous wrapper for validatableObject ({HttpRequest}, {HttpResponse}) - isValid method
isValid = (real, expected, type, cb) ->
  switch type
    when 'request'
      validatableObject = new HttpRequest real
      validatableObject['expected']= new ExpectedHttpRequest expected
    when 'response'
      validatableObject = new HttpRequest real
      validatableObject['expected']= new ExpectedHttpRequest expected

  proxy validatableObject, 'isValid', cb

#asynchronous wrapper for validatableObject ({HttpRequest}, {HttpResponse}) - isValidatable method
isValidatable = (real,expected, type, cb) ->
  switch type
    when 'request'
      validatableObject = new HttpRequest real
      validatableObject['expected']= new ExpectedHttpRequest expected
    when 'response'
      validatableObject = new HttpRequest real
      validatableObject['expected']= new ExpectedHttpRequest expected
      
  proxy validatableObject, 'isValidatable', cb

#@private
#asynchronous wrapper for validatableObject ({HttpRequest}, {HttpResponse}) - validate method
validate = (real, expected, type, cb) ->
  switch type
    when 'request'
      validatableObject = new HttpRequest real
      validatableObject['expected']= new ExpectedHttpRequest expected
    when 'response'
      validatableObject = new HttpRequest real
      validatableObject['expected']= new ExpectedHttpRequest expected
    
  proxy validatableObject, 'validate', cb

module.exports = {
  validate,
  isValid,
  isValidatable
}