{assert} = require('chai')
amanda = require 'amanda'

sampleJsonNoValid = '''
{a:1}
'''

sampleJson = '''
{
  "simple_key_value_pair": "simple_key_value_pair_value",
  "complex_key_value_pair": {
    "complex_key_value_pair_key1" : "complex_key_value_pair_value1",
    "complex_key_value_pair_key2" : "complex_key_value_pair_value2",
    "complex_key_value_pair_key3" : {
      "complex_key_value_pair_key1_in_nested_hash": "complex_key_value_pair_value1_in_nested_hash",
      "complex_key_value_pair_key2_in_nested_hash": "complex_key_value_pair_value2_in_nested_hash"
      }
    },

  "array_of_hashes": [
    {
      "array_of_hashes_item1_key1": "array_of_hashes_item1_value1",
      "array_of_hashes_item1_key2": "array_of_hashes_item1_value2"
    },
    {
      "array_of_hashes_item2_key1": "array_of_hashes_item2_value1",
      "array_of_hashes_item2_key2": "array_of_hashes_item2_value2"
    }

  ],
  "array_of_mixed_simple_types": [1,2,"a","b"],
  "array_of_same_simple_types": ["a","b"]
}
'''


{SchemaGenerator, SchemaProperties} = require('../src/schema-generator')

describe 'SchemaGenerator', ->
  sg = {}
  before ->
    sg = new SchemaGenerator sampleJson

  describe '#constructor', ->
    it 'should assign and parse @json', ->
      assert.deepEqual sg.json, JSON.parse sampleJson
    it 'should initiate @properties', ->
      assert.isTrue sg.properties instanceof SchemaProperties

  describe 'setProperties', ->
  describe 'setProperties', ->
    before ->
      sg.setProperties keysStrict: true, valuesStrict: true, typesStrict: true

    it 'should chenge properties object', ->
      assert.isTrue sg.properties.keysStrict
      assert.isTrue sg.properties.valuesStrict
      assert.isTrue sg.properties.typesStrict

  describe 'generate', ->
    schema = undefined
    before ->
      sg.setProperties keysStrict: true, valuesStrict: true, typesStrict: false
      schema = sg.generate()

    it 'should set @schema', ->
      assert.isDefined sg.schema

    it 'and returned schema should ne equal', ->
      assert.equal schema, sg.schema

    it 'return valid json', ->
      assert.doesNotThrow () -> JSON.stringify schema

    it 'which is valid json schema for amanda (doesNotThrow)', ->
      assert.doesNotThrow () -> amanda.validate  sampleJson, sg.schema, (error) ->
        return



