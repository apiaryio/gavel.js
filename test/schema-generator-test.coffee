{assert} = require('chai')

sampleJson = {}

{SchemaGenerator} = require('../src/schema-generator')

describe 'SchemaGenerator', ->
  sg = new SchemaGenerator sampleJson

  it 'should assign @json', ->
    assert.strictEqual sg.json, sampleJson
