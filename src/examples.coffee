async       = require 'async'

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

async.series [
  (cb) ->
    console.error '----------------------------------'
    console.error 'HttpRequest called on object'
    httpRequest.validate (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    httpRequest.isValidatable (err, result) ->
      console.error result
      cb err, result
  (cb) ->
    httpRequest.isValid (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    console.error '----------------------------------'
    console.error 'HttpRequest called by wrapper'
    validate httpRequest, (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    isValidatable httpRequest, (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    isValid httpRequest, (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    console.error '----------------------------------'
    console.error 'httpResponse called on object'
    httpResponse.validate (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    httpResponse.isValidatable (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    httpResponse.isValid (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    console.error '----------------------------------'
    console.error 'httpResponse called by wrapper'
    validate httpResponse, (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    isValidatable httpResponse, (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    isValid httpResponse, (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    console.error '----------------------------------'
    console.error 'httpMessage called on object'
    httpMessage.validate (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    httpMessage.isValidatable (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    httpMessage.isValid (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    console.error '----------------------------------'
    console.error 'httpMessage called by wrapper'
    validate httpMessage, (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    isValidatable httpMessage, (err, result) ->
      console.error result
      cb err, result
  ,(cb) ->
    isValid httpMessage, (err, result) ->
      console.error result
      cb err, result
  ]

