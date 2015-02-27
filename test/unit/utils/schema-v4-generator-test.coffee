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

  describe 'when I provide string with JSONized string', () ->
    it 'should not throw exception', ->
      fn = () ->
        sg = new SchemaV4Generator json: '"Number of profiles deleted: com.viacom.auth.infrastructure.DocumentsUpdated@1"'
        sg.properties =
          keysStrict: false
          typesStrict: false
          valuesStrict: false
        sg.generate()
      assert.doesNotThrow fn

  describe 'when empty object on root level',() ->
    it 'should type validation in the schema on root level', () ->
      sg = new SchemaV4Generator json: "{}"
      sg.properties =
        keysStrict: false
        typesStrict: false
        valuesStrict: false
      assert.propertyVal sg.generate(), 'type', 'object'


  describe 'when empty array on root level', () ->
    it 'should type validation in the schema on root level', () ->
      sg = new SchemaV4Generator json: "[]"
      sg.properties =
        keysStrict: false
        typesStrict: false
        valuesStrict: false
      assert.propertyVal sg.generate(), 'type', 'array'

  describe 'when string on root level', () ->
    it 'should type validation in the schema on root level', () ->
      sg = new SchemaV4Generator json: '"booboo"'
      sg.properties =
        keysStrict: false
        typesStrict: false
        valuesStrict: false
      assert.propertyVal sg.generate(), 'type', 'string'

  describe 'when number on root level', () ->
    it 'should type validation in the schema on root level', () ->
      sg = new SchemaV4Generator json: '1.1'
      sg.properties =
        keysStrict: false
        typesStrict: false
        valuesStrict: false
      assert.propertyVal sg.generate(), 'type', 'number'

  describe 'when integer on root level', () ->
    it 'should type validation in the schema on root level', () ->
      sg = new SchemaV4Generator json: '1'
      sg.properties =
        keysStrict: false
        typesStrict: false
        valuesStrict: false
      assert.propertyVal sg.generate(), 'type', 'integer'

  describe 'when boolean on root level', () ->
    it 'should type validation in the schema on root level', () ->
      sg = new SchemaV4Generator json: 'true'
      sg.properties =
        keysStrict: false
        typesStrict: false
        valuesStrict: false
      assert.propertyVal sg.generate(), 'type', 'boolean'

  describe 'when null on root level', () ->
    it 'should type validation in the schema on root level', () ->
      sg = new SchemaV4Generator json: 'null'
      sg.properties =
        keysStrict: false
        typesStrict: false
        valuesStrict: false
      assert.propertyVal sg.generate(), 'type', 'null'

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





