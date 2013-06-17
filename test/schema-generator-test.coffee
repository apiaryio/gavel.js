{assert} = require('chai')
amanda = require 'amanda'


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

sampleJsonSchema = '''
{
    "$schema":"http://json-schema.org/draft-03/schema",
    "id":"#",
    "required":true,
    "additionalProperties":false,
    "type":"object",
    "properties":{
        "simple_key_value_pair":{
            "id":"simple_key_value_pair",
            "required":true,
            "enum":[
                "simple_key_value_pair_value"
            ],
            "type":"string"
        },
        "complex_key_value_pair":{
            "id":"complex_key_value_pair",
            "required":true,
            "additionalProperties":false,
            "type":"object",
            "properties":{
                "complex_key_value_pair_key1":{
                    "id":"complex_key_value_pair_key1",
                    "required":true,
                    "enum":[
                        "complex_key_value_pair_value1"
                    ],
                    "type":"string"
                },
                "complex_key_value_pair_key2":{
                    "id":"complex_key_value_pair_key2",
                    "required":true,
                    "enum":[
                        "complex_key_value_pair_value2"
                    ],
                    "type":"string"
                },
                "complex_key_value_pair_key3":{
                    "id":"complex_key_value_pair_key3",
                    "required":true,
                    "additionalProperties":false,
                    "type":"object",
                    "properties":{
                        "complex_key_value_pair_key1_in_nested_hash":{
                            "id":"complex_key_value_pair_key1_in_nested_hash",
                            "required":true,
                            "enum":[
                                "complex_key_value_pair_value1_in_nested_hash"
                            ],
                            "type":"string"
                        },
                        "complex_key_value_pair_key2_in_nested_hash":{
                            "id":"complex_key_value_pair_key2_in_nested_hash",
                            "required":true,
                            "enum":[
                                "complex_key_value_pair_value2_in_nested_hash"
                            ],
                            "type":"string"
                        }
                    }
                }
            }
        },
        "array_of_hashes":{
            "id":"array_of_hashes",
            "required":true,
            "additionalItems":false,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true,
                    "additionalProperties":false,
                    "type":"object",
                    "properties":{
                        "array_of_hashes_item1_key1":{
                            "id":"array_of_hashes_item1_key1",
                            "required":true,
                            "enum":[
                                "array_of_hashes_item1_value1"
                            ],
                            "type":"string"
                        },
                        "array_of_hashes_item1_key2":{
                            "id":"array_of_hashes_item1_key2",
                            "required":true,
                            "enum":[
                                "array_of_hashes_item1_value2"
                            ],
                            "type":"string"
                        }
                    }
                },
                {
                    "id":1,
                    "required":true,
                    "additionalProperties":false,
                    "type":"object",
                    "properties":{
                        "array_of_hashes_item2_key1":{
                            "id":"array_of_hashes_item2_key1",
                            "required":true,
                            "enum":[
                                "array_of_hashes_item2_value1"
                            ],
                            "type":"string"
                        },
                        "array_of_hashes_item2_key2":{
                            "id":"array_of_hashes_item2_key2",
                            "required":true,
                            "enum":[
                                "array_of_hashes_item2_value2"
                            ],
                            "type":"string"
                        }
                    }
                }
            ]
        },
        "array_of_mixed_simple_types":{
            "id":"array_of_mixed_simple_types",
            "required":true,
            "additionalItems":false,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true,
                    "enum":[
                        1
                    ],
                    "type":"integer"
                },
                {
                    "id":1,
                    "required":true,
                    "enum":[
                        2
                    ],
                    "type":"integer"
                },
                {
                    "id":2,
                    "required":true,
                    "enum":[
                        "a"
                    ],
                    "type":"string"
                },
                {
                    "id":3,
                    "required":true,
                    "enum":[
                        "b"
                    ],
                    "type":"string"
                }
            ]
        },
        "array_of_same_simple_types":{
            "id":"array_of_same_simple_types",
            "required":true,
            "additionalItems":false,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true,
                    "enum":[
                        "a"
                    ],
                    "type":"string"
                },
                {
                    "id":1,
                    "required":true,
                    "enum":[
                        "b"
                    ],
                    "type":"string"
                }
            ]
        }
    }

}
'''

sampleJsonSchemaNonStrict = '''
{
    "$schema":"http://json-schema.org/draft-03/schema",
    "id":"#",
    "required":true,
    "additionalProperties":true,
    "type":"object",
    "properties":{
        "simple_key_value_pair":{
            "id":"simple_key_value_pair",
            "required":true
        },
        "complex_key_value_pair":{
            "id":"complex_key_value_pair",
            "required":true,
            "additionalProperties":true,
            "type":"object",
            "properties":{
                "complex_key_value_pair_key1":{
                    "id":"complex_key_value_pair_key1",
                    "required":true
                },
                "complex_key_value_pair_key2":{
                    "id":"complex_key_value_pair_key2",
                    "required":true
                },
                "complex_key_value_pair_key3":{
                    "id":"complex_key_value_pair_key3",
                    "required":true,
                    "additionalProperties":true,
                    "type":"object",
                    "properties":{
                        "complex_key_value_pair_key1_in_nested_hash":{
                            "id":"complex_key_value_pair_key1_in_nested_hash",
                            "required":true
                        },
                        "complex_key_value_pair_key2_in_nested_hash":{
                            "id":"complex_key_value_pair_key2_in_nested_hash",
                            "required":true
                        }
                    }
                }
            }
        },
        "array_of_hashes":{
            "id":"array_of_hashes",
            "required":true,
            "additionalItems":true,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true,
                    "additionalProperties":true,
                    "type":"object",
                    "properties":{
                        "array_of_hashes_item1_key1":{
                            "id":"array_of_hashes_item1_key1",
                            "required":true
                        },
                        "array_of_hashes_item1_key2":{
                            "id":"array_of_hashes_item1_key2",
                            "required":true
                        }
                    }
                },
                {
                    "id":1,
                    "required":true,
                    "additionalProperties":true,
                    "type":"object",
                    "properties":{
                        "array_of_hashes_item2_key1":{
                            "id":"array_of_hashes_item2_key1",
                            "required":true
                        },
                        "array_of_hashes_item2_key2":{
                            "id":"array_of_hashes_item2_key2",
                            "required":true
                        }
                    }
                }
            ]
        },
        "array_of_mixed_simple_types":{
            "id":"array_of_mixed_simple_types",
            "required":true,
            "additionalItems":true,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true
                },
                {
                    "id":1,
                    "required":true
                },
                {
                    "id":2,
                    "required":true
                },
                {
                    "id":3,
                    "required":true
                }
            ]
        },
        "array_of_same_simple_types":{
            "id":"array_of_same_simple_types",
            "required":true,
            "additionalItems":true,
            "type":"array",
            "items":[
                {
                    "id":0,
                    "required":true
                },
                {
                    "id":1,
                    "required":true
                }
            ]
        }
    }
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
    before ->
      sg.setProperties keysStrict: true, valuesStrict: true, typesStrict: true

    it 'should chenge properties object', ->
      assert.isTrue sg.properties.keysStrict
      assert.isTrue sg.properties.valuesStrict
      assert.isTrue sg.properties.typesStrict

  describe 'generate', ->
    schema = undefined
    before ->
      sg.setProperties keysStrict: true, valuesStrict: true, typesStrict: true
      schema = sg.generate()

    it 'should set @schema', ->
      assert.isDefined sg.schema

    it 'and returned schema should be equal', ->
      assert.equal schema, sg.schema

    it 'and schema should be valid json', ->
      assert.doesNotThrow () -> JSON.stringify schema

    it 'which is valid json schema for amanda (doesNotThrow)', ->
      assert.doesNotThrow () -> amanda.validate  sampleJson, sg.schema, (error) ->
        return

    it 'which is expected strict schema', ->
      assert.deepEqual JSON.parse(sampleJsonSchema),  sg.schema

  describe 'generate non strict schema', ->
    before ->
      sg.setProperties keysStrict: false, valuesStrict: false, typesStrict: false

    it 'should be expected non strict schema', ->
      assert.deepEqual JSON.parse(sampleJsonSchemaNonStrict),  sg.generate()




