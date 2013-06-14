{assert} = require('chai')
amanda = require 'amanda'

sampleJsonNoValid = '''
{a:1}
'''

sampleJson = '''
{
  "items": [
    [ { "url": "/shopping-cart/1", "product":"2ZY48XPZ", "quantity": 1, "name": "New socks", "price": 1.25 },
      { "url": "/shopping-cart/2", "product":"2ZY48XPZaa", "quantity": 2, "name": "New socks2", "price": 1.99 }
    ],
    [ { "url": "/shopping-cart/1", "product":"2ZY48XPZ", "quantity": 1, "name": "New socks", "price": 1.25 },
    { "url": "/shopping-cart/2", "product":"2ZY48XPZaa", "quantity": 2, "name": "New socks2", "price": 1.99 }
    ]
  ],
  "item2" : {
  "item2_item1" : {"nested1": 1},
  "item2_item1" : {"nested2": {"a": 2}}
  }
}
'''

sampleJsonWrong = '''{
"items": [
  [ { "url": "/shopping-cart/1", "product":"2ZY48XaPZ", "quantity": 1, "name": "New socks", "price": 1.25 },
    { "url": "/shopping-cart/2", "product":"2ZY48XPZaa", "quantity": 2, "name": "New socks2", "price": 1.99 }
  ],
  [ { "url": "/shopping-cart/1", "product":"2ZY48XPZ", "quantity": 1, "name": "New socks", "price": 1.25 },
    { "url": "/shopping-cart/2", "product":"2ZY48XPZaa", "quantity": 2, "name": "New socks2", "price": 1.99 }
  ]
],
"item2" : {
"item2_item1" : {"nested1": 1},
"item2_item1" : {"nested2": {"a": 2}}
}
}'''

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



