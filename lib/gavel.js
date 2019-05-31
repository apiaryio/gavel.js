const { HttpRequest, ExpectedHttpRequest } = require('./model/http-request');
const { HttpResponse, ExpectedHttpResponse } = require('./model/http-response');

const validate = require('./next/validate');

module.exports = {
  // next
  validate,

  // legacy
  HttpRequest,
  HttpResponse,
  ExpectedHttpRequest,
  ExpectedHttpResponse
};
