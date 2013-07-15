{assert} = require('chai')
{BodyValidator} = require('../../../src/validators/body-validator')
{StringValidator} = require '../../../src/validators/string-validator'
{JsonValidator}   = require '../../../src/validators/json-validator'

fixtures = require '../../fixtures'

describe 'BodyValidator', ->
  bodyValidator = {}
  describe 'constructor', ->
    describe 'when I provide non string real data', ->
      it 'should throw exception', ->
        fn = () ->
          bodyValidator = new BodyValidator real: ('malformed':'malformed '),expected: "{'header1': 'value1'}", schema: null
        assert.throws fn

    describe 'when I provide non string  expected data', ->
      it 'should throw exception', ->
        fn = () ->
          bodyValidator = new BodyValidator real: "{'header1': 'value1'}",expected: ('malformed':'malformed '), schema: null
        assert.throws fn

    describe 'when I provide malformed schema', ->
      it 'should throw exception', ->
        fn = () ->
          bodyValidator = new BodyValidator real: "{'header1': 'value1'}",expected: "{'header1': 'value1'}", schema: 'malformed'
        assert.throws fn
   
    describe 'when I provide valid schema as string', ->
      it 'should not throw exception', ->
        fn = () ->
          schemaString = '{"type":"object","$schema":"http://json-schema.org/draft-03/schema","required":true,"properties":{"object":{"type":"object","required":false,"properties":{"a":{"type":"string","required":true},"c":{"type":"string","required":true},"e":{"type":"string","required":true}}},"string":{"type":"string","required":true}}}'
          bodyValidator = new BodyValidator real: "{'header1': 'value1'}",expected: "{'header1': 'value1'}", schema: schemaString
        assert.doesNotThrow fn
    
    describe 'when I do not provide schema or expected', ->
      it 'should throw exception', ->
        fn = () ->
          bodyValidator = new BodyValidator real: {'header1': 'value1'},expected: null, schema: null
        assert.throws fn

    describe 'when I provide correct data', ->
      it 'should not throw exception', ->
        fn = () ->
          bodyValidator = new BodyValidator real: "{'header1': 'value1'}", expected: "{'header1': 'value1'}", schema: {'header1': 'value1'}
        assert.doesNotThrow fn

    describe 'when I do not provide real, expected and schema', ->
      it 'should not throw exception', ->
        fn = () ->
          bodyValidator = new BodyValidator real: null, expected: null, schema: null
        assert.doesNotThrow fn


    describe 'when I do not provide schema', ->
      before ->
        bodyValidator = new BodyValidator real: fixtures.sampleJson, expected: fixtures.sampleJson, schema: null

      it 'correct schema should be generated', ->
        assert.deepEqual bodyValidator.schema, JSON.parse fixtures.sampleJsonSchemaNonStrict

    describe 'when expected and real data are json parsable', ->
      before ->
        bodyValidator = new BodyValidator real: fixtures.sampleJson ,expected: fixtures.sampleJson, schema: null
      it 'should set json validator', ->
        assert.isTrue bodyValidator.validator instanceof JsonValidator

      describe 'when provided real and expected data are the same', ->
        before ->
          bodyValidator = new BodyValidator real: fixtures.sampleJson ,expected: fixtures.sampleJson, schema: null
        describe 'and i run validate()', ->
          it "shouldn't return any errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 0

      describe 'when key is missing in provided real data', ->
        before ->
          bodyValidator = new BodyValidator real: fixtures.sampleJsonSimpleKeyMissing ,expected: fixtures.sampleJson, schema: null
        describe 'and i run validate()', ->
          it "should return 1 errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 1

      describe 'when value in provided and expected data differs', ->
        before ->
          bodyValidator = new BodyValidator real: fixtures.sampleJsonSimpleKeyValueDiffers ,expected: fixtures.sampleJson, schema: null
        describe 'and i run validate()', ->
          it "shouldn't return any errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 0

      describe 'when key is added to provided data', ->
        before ->
          bodyValidator = new BodyValidator real: fixtures.sampleJsonComplexKeyAdded ,expected: fixtures.sampleJson, schema: null
        describe 'and i run validate()', ->
          it "shouldn't return any errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 0


      describe 'when provided real data match provided schema', ->
        before ->
          bodyValidator = new BodyValidator real: fixtures.sampleJsonComplexKeyAdded ,expected: null, schema: JSON.parse fixtures.sampleJsonSchemaNonStrict
        describe 'and i run validate()', ->
          it "shouldn't return any errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 0

      describe 'when provided real data does not match provided schema', ->
        before ->
          bodyValidator = new BodyValidator real: fixtures.sampleJsonSimpleKeyMissing ,expected: '', schema: JSON.parse fixtures.sampleJsonSchemaNonStrict
        describe 'and i run validate()', ->
          it "should return 1 errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 1

    describe 'when expected or real data are not json parsable', ->
      before ->
        bodyValidator = new BodyValidator real: "aaaaa" ,expected: "bbbb", schema: null
      it 'should set string validator', ->
        assert.isTrue bodyValidator.validator instanceof StringValidator

      describe 'when provided real and expected data are the same', ->
        before ->
          bodyValidator = new BodyValidator real: fixtures.sampleText ,expected: fixtures.sampleText, schema: null
        describe 'and i run validate()', ->
          it "shouldn't return any errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 0

      describe 'when provided real and expected data differs', ->
        before ->
          bodyValidator = new BodyValidator real: fixtures.sampleTextLineAdded ,expected: fixtures.sampleText, schema: null
        describe 'and i run validate()', ->
          it "should return 1 errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 1

