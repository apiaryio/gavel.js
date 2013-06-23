@pending
Feature: HTTP hit model

  Hit model can by represented by following JSON structure. We use dot notation and JSON data types for model attributes description. 
   
  url

  request

  request.expected
  request.expected.body
  request.expected.bodySchema
  request.expected.headers
  
  request.real
  request.real.body
  request.real.headers

  response
  
  response.expected
  response.expected.body
  response.expected.bodySchema
  response.expected.headers
  
  response.real
  response.real.body
  response.real.headers
  response.real.statusCode
  
  schemaVersion


Background:
  Given Hit model is defined by following JSON Schema

Scenario: Hit model JSON serialization
  When HIT model is serialized to JSON
  Then it should be valid against given schema

