{assert} = require('chai')

sample_json = {}

{SchemaGenerator} = require('../src/schema-generator')

describe 'SchemaGenerator', ->
  sg = new SchemaGenerator sample_json

  it 'should assign @json', ->
    assert.strictEqual sg.json, sample_json
