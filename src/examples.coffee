
{HttpRequest, ExpectedHttpRequest} = require('./model/http-request')
{HttpResponse, ExpectedHttpResponse} = require('./model/http-response')
{HttpMessage} = require('./model/http-message')

{validate,isValid,isValidatable} = require('./validate')


expectedHttpRequestProps =
  method: 'GET',
  url: 'http://www.google.com',
  headers: {'h1': 'v1', 'h2': 'v2'},
  body: '{"k2": "v1"}',
  headersSchema: null,
  bodySchema: null
expectedHttpRequest = new ExpectedHttpRequest expectedHttpRequestProps

httpRequestProps =
  method: 'GET',
  url: 'http://www.google.com',
  headers: {'h1': 'v1', 'h2': 'v2'},
  body: '{"k2": "v1"}',
  expected: expectedHttpRequest

httpRequest = new HttpRequest httpRequestProps


expectedHttpResponseProps =
  statusCode: 200,
  statusMessage: 'statusMessage',
  headers: {'h1': 'v1', 'h2': 'v2'},
  body: '{"k2": "v1"}',
  headersSchema: null,
  bodySchema: null
expectedHttpResponse = new ExpectedHttpResponse expectedHttpResponseProps

httpResponseProps =
  statusCode: 200,
  statusMessage: 'statusMessage',
  headers: {'h1': 'v1', 'h2': 'v2'},
  body: '{"k2": "v1"}',
  expected: expectedHttpResponse

httpResponse = new HttpResponse httpResponseProps

httpMessageProps =
  httpRequest: httpRequest,
  httpResponse: httpResponse

httpMessage = new HttpMessage httpMessageProps

console.error 'HttpRequest'
console.error httpRequest.validate()
console.error httpRequest.isValidatable()
console.error httpRequest.isValid()

console.error validate(httpRequest)
console.error isValidatable(httpRequest)
console.error isValid(httpRequest)

console.error 'httpResponse'
console.error httpResponse.validate()
console.error httpResponse.isValidatable()
console.error httpResponse.isValid()

console.error validate(httpResponse)
console.error isValidatable(httpResponse)
console.error isValid(httpResponse)

console.error 'httpResponse'
console.error httpResponse.validate()
console.error httpResponse.isValidatable()
console.error httpResponse.isValid()

console.error validate(httpResponse)
console.error isValidatable(httpResponse)
console.error isValid(httpResponse)

