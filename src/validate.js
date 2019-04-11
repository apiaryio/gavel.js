const { HttpRequest, ExpectedHttpRequest } = require('./model/http-request')
const { HttpResponse, ExpectedHttpResponse } = require('./model/http-response')

function proxy(validatableObject, method, cb) {
  let result

  try {
    result = validatableObject[method]()
  } catch (error) {
    return cb(error, null)
  }

  return cb(null, result)
}

function getValidatableObject(real, expected, type) {
  const isRequest = type === 'request'
  const validatableObject = isRequest
    ? new HttpRequest(real)
    : new HttpResponse(real)
  validatableObject.expected = isRequest
    ? new ExpectedHttpRequest(expected)
    : new ExpectedHttpResponse(expected)

  return validatableObject
}

function isValid(real, expected, type, cb) {
  return proxy(getValidatableObject(real, expected, type), 'isValid', cb)
}

function isValidatable(real, expected, type, cb) {
  return proxy(getValidatableObject(real, expected, type), 'isValidatable', cb)
}

function validate(real, expected, type, cb) {
  return proxy(getValidatableObject(real, expected, type), 'validate', cb)
}

module.exports = {
  validate,
  isValid,
  isValidatable,
}
