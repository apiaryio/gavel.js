{assert} = require('chai')
amanda = require 'amanda'
{sampleJson, sampleJsonSchema, sampleJsonSchemaNonStrict} = require '../../fixtures'

{SchemaGenerator, SchemaProperties} = require('../../../src/utils/schema-generator')

describe 'SchemaGenerator', ->
  sg = {}
  before ->
    sg = new SchemaGenerator json: sampleJson

  describe '#constructor', ->
    it 'should assign and parse @json', ->
      assert.deepEqual sg.json, JSON.parse sampleJson
    it 'should initiate @properties', ->
      assert.isTrue sg.properties instanceof SchemaProperties

  describe 'set properties', ->
    before ->
      sg.properties.set keysStrict: true, valuesStrict: true, typesStrict : true

    it 'should change properties object', ->
      assert.isTrue sg.properties.keysStrict
      assert.isTrue sg.properties.valuesStrict
      assert.isTrue sg.properties.typesStrict

  describe 'generate', ->
    schema = undefined
    before ->
      sg.properties.keysStrict   = true
      sg.properties.valuesStrict = true
      sg.properties.typesStrict  = true

      schema = sg.generate()

    it 'should set @schema', ->
      assert.isDefined sg.schema

    it 'and returned schema should be equal', ->
      assert.equal schema, sg.schema

    it 'and schema should be valid json', ->
      assert.doesNotThrow () -> JSON.stringify schema

    it 'which is valid json schema for amanda (doesNotThrow)', ->
      assert.doesNotThrow () -> amanda.validate  JSON.parse(sampleJson), sg.schema, (error) ->
        return

    it 'which is expected strict schema', ->
      assert.deepEqual JSON.parse(sampleJsonSchema),  sg.schema

  describe 'generate non strict schema', ->
    before ->
      sg.properties.keysStrict   = false
      sg.properties.valuesStrict = false
      sg.properties.typesStrict  = false

    it 'should be expected non strict schema', ->
      assert.deepEqual JSON.parse(sampleJsonSchemaNonStrict),  sg.generate()





