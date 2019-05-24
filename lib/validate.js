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
  let request;
  let response;

  switch (type) {
    case 'request':
      request = new HttpRequest(real);
      request.expected = new ExpectedHttpRequest(expected);
      return request;
    case 'response':
      response = new HttpResponse(real);
      response.expected = new ExpectedHttpResponse(expected);
      return response;
    default:
      throw new Error(
        `Can't validate: expected HTTP message type to be "request" or "response", but got: ${type}.`
      );
  }
}

function isValid(real, expected, type, cb) {
  console.warn(`\
Usage of "isValid" is deprecated and will be removed in the future releases of Gavel.
Use "isValid" property of the validation result instead:

const { validate } = require('gavel');

const result = validate(real, expected, 'request');
const { isValid } = result;\
`);

  return proxy(getValidatableObject(real, expected, type), 'isValid', cb);
}

function isValidatable(real, expected, type, cb) {
  return proxy(getValidatableObject(real, expected, type), 'isValidatable', cb);
}

module.exports = {
  isValid,
  isValidatable
};
