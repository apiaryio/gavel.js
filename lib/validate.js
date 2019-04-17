const { HttpRequest, ExpectedHttpRequest } = require('./model/http-request');
const { HttpResponse, ExpectedHttpResponse } = require('./model/http-response');

function proxy(validatableObject, method, cb) {
  let result;

  try {
    result = validatableObject[method]();
  } catch (error) {
    return cb(error, null);
  }

  return cb(null, result);
}

/**
 * @param {string} real
 * @param {string} expected
 * @param {'request'|'response'} type
 */
function getValidatableObject(real, expected, type) {
  switch (type) {
    case 'request':
      const request = new HttpRequest(real);
      request.expected = new ExpectedHttpRequest(expected);
      return request;
    case 'response':
      const response = new HttpResponse(real);
      response.expected = new ExpectedHttpResponse(expected);
      return response;
  }
}

function isValid(real, expected, type, cb) {
  return proxy(getValidatableObject(real, expected, type), 'isValid', cb);
}

function isValidatable(real, expected, type, cb) {
  return proxy(getValidatableObject(real, expected, type), 'isValidatable', cb);
}

function validate(real, expected, type, cb) {
  return proxy(getValidatableObject(real, expected, type), 'validate', cb);
}

module.exports = {
  validate,
  isValid,
  isValidatable
};
