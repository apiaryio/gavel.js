{assert} = require('chai')
{HttpRequest, ExpectedHttpRequest} = require('../../src/model/http-request')
{sampleHttpRequestSchema} = require '../fixtures'

amanda = require 'amanda'

validate = (data, schema) ->
  return amanda.validate  data, schema, (error) =>
    return error

describe 'HttpRequest', ->
  httpRequest = {}
  describe 'when I create new instance', ->
    before ->
      expectedHttpRequest = new ExpectedHttpRequest {method: '1', url: '2', headers: '3', body: '4', headersSchema: {"type":"object"}, bodySchema: {"type":"object"}}
      httpRequest = new HttpRequest method: '1', url: '2', headers: '3', body: '4', expected: expectedHttpRequest

    it 'should has correct structure', ->
      assert.isUndefined validate JSON.parse(JSON.stringify(httpRequest)), sampleHttpRequestSchema

    it 'should has validate method', ->
      assert.isDefined httpRequest.validate

    it 'should has isValidatable method', ->
      assert.isDefined httpRequest.isValidatable

    it 'should has isValid method', ->
      assert.isDefined httpRequest.isValid

