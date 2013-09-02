{assert} = require('chai')
{HttpResponse, ExpectedHttpResponse} = require('../../../src/model/http-response')
{sampleHttpResponseSchema} = require '../../fixtures'

amanda = require 'amanda'

validate = (data, schema) ->
  return amanda.validate  data, schema, (error) =>
    return error

describe 'HttpResponse', ->
  httpResponse = {}
  describe 'when I create new instance', ->
    before ->
      expectedHttpResponse = new ExpectedHttpResponse {statusCode: '1', statusMessage: '2', headers: '3', body: '4', headersSchema: {"type":"object"}, bodySchema: {"type":"object"}}
      httpResponse = new HttpResponse statusCode: '1', statusMessage: '2', headers: '3', body: '4', expected: expectedHttpResponse

    it 'should has correct structure', ->
      assert.isUndefined validate JSON.parse(JSON.stringify(httpResponse)), sampleHttpResponseSchema

    it 'should has validate method', ->
      assert.isDefined httpResponse.validate

    it 'should has isValid method', ->
      assert.isDefined httpResponse.isValid