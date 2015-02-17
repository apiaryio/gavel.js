{assert} = require('chai')
amanda = require 'amanda'
tv4 = require 'tv4'

{sampleJson, sampleJsonSchema, sampleJsonSchemaNonStrict} = require '../../fixtures'
{SchemaV4Generator, SchemaV4Properties} = require('../../../src/utils/schema-v4-generator')

describe 'SchemaV4Generator', ->
  sg = {}
  before ->
    sg = new SchemaV4Generator json: sampleJson

  describe '#constructor', ->
    it 'should assign and parse @json', ->
      assert.deepEqual sg.json, JSON.parse sampleJson
    it 'should initiate @properties', ->
      assert.isTrue sg.properties instanceof SchemaV4Properties

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

  describe 'generate strict schema only for some caseless keys', ->

    before ->
      expected =
        "content-type": "application/json"
        "location": "/here"
      sg = new SchemaV4Generator json: expected
      sg.properties =
        keysStrict: true
        typesStrict: false
        valuesStrict: ['content-type']
      sg.generate()

    describe 'when missing key and its value completely', () ->
      it 'should fail the validation against generated schema', () ->
        realMissingKey =
          "content-type": "application/json"
        assert.notOk tv4.validateResult(realMissingKey, sg.schema).valid

    describe 'when different value of strict', () ->
      it 'should fail the validation against generated schema', () ->
        realDifferentValueOfStrict =
          "content-type": "application/hal+json"
          "location": "/here"
        assert.notOk tv4.validateResult(realDifferentValueOfStrict, sg.schema).valid

    describe 'when different value of non strict', () ->
      it 'should pass the validation against generated schema', () ->
        realDifferentValueOfNonStrict =
          "content-type": "application/json"
          "location": "/there"
        assert.ok tv4.validateResult(realDifferentValueOfNonStrict, sg.schema).valid





