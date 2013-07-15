{assert} = require('chai')
{HttpMessage} = require('../../../src/model/http-message')
{HttpRequest, ExpectedHttpRequest} = require('../../../src/model/http-request')
{HttpResponse, ExpectedHttpResponse} = require('../../../src/model/http-response')

{sampleHttpMessageSchema} = require '../../fixtures'

amanda = require 'amanda'

validate = (data, schema) ->
  return amanda.validate  data, schema, singleError = false, (error) ->
    return error

describe 'HttpMessage', ->
  httpMessage = {}
  describe 'when I create new instance', ->
    before ->
      expectedHttpRequest = new ExpectedHttpRequest {method: '1', uri: '2', headers: '3', body: '4', headersSchema: {"type":"object"}, bodySchema: {"type":"object"}}
      httpRequest = new HttpRequest method: '1', uri: '2', headers: '3', body: '4', expected: expectedHttpRequest
      expectedHttpResponse = new ExpectedHttpResponse {statusCode: '1', statusMessage: '2', headers: '3', body: '4', headersSchema: {"type":"object"}, bodySchema: {"type":"object"}}
      httpResponse = new HttpResponse statusCode: '1', statusMessage: '2', headers: '3', body: '4', expected: expectedHttpResponse
      httpMessage = new HttpMessage httpRequest: httpRequest,  httpResponse: httpResponse

    it 'should has correct structure', ->
      assert.isUndefined validate JSON.parse(JSON.stringify(httpMessage)), sampleHttpMessageSchema

    it 'should has validate method', ->
      assert.isDefined httpMessage.validate

    it 'should has isValidatable method', ->
      assert.isDefined httpMessage.isValidatable

    it 'should has isValid method', ->
      assert.isDefined httpMessage.isValid