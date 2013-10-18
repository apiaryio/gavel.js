{assert} = require('chai')
{JsonExample} = require('../../../src/validators/json-example')
{JsonSchema}   = require '../../../src/validators/json-schema'
shared = require '../support/amanda-to-gavel-shared'
fixtures = require '../../fixtures'

describe 'JsonExample', ->
  bodyValidator = {}
  describe 'constructor', ->
    describe 'when I provide non string real data', ->
      it 'should throw exception', ->
        fn = () ->
          bodyValidator = new JsonExample ('malformed':'malformed '),"{'header1': 'value1'}"
        assert.throws fn

    describe 'when I provide non string expected data', ->
      it 'should throw exception', ->
        fn = () ->
          bodyValidator = new JsonExample "{'header1': 'value1'}",('malformed':'malformed '), schema: null
        assert.throws fn

    describe 'when I provide correct data', ->
      it 'should not throw exception', ->
        fn = () ->
          bodyValidator = new JsonExample '{"header1": "value1"}', '{"header1": "value1"}'
        assert.doesNotThrow fn

    describe 'when expected and real data are json parsable', ->
      before ->
        bodyValidator = new JsonExample fixtures.sampleJson ,fixtures.sampleJson
      it 'should set json validator', ->
        assert.isTrue bodyValidator.validator instanceof JsonSchema

      describe 'when provided real and expected data are the same', ->
        before ->
          bodyValidator = new JsonExample fixtures.sampleJson ,fixtures.sampleJson
        describe 'and i run validate()', ->
          it "shouldn't return any errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 0

      describe 'when key is missing in provided real data', ->
        before ->
          bodyValidator = new JsonExample fixtures.sampleJsonSimpleKeyMissing ,fixtures.sampleJson
        describe 'and i run validate()', ->
          it "should return 1 errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 1

      describe 'when value in provided and expected data differs', ->
        before ->
          bodyValidator = new JsonExample fixtures.sampleJsonSimpleKeyValueDiffers ,fixtures.sampleJson
        describe 'and i run validate()', ->
          it "shouldn't return any errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 0

      describe 'when key is added to provided data', ->
        before ->
          bodyValidator = new JsonExample fixtures.sampleJsonComplexKeyAdded ,fixtures.sampleJson
        describe 'and i run validate()', ->
          it "shouldn't return any errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 0
  
      describe 'when key value is a empty string', ->
        before ->
          bodyValidator = new JsonExample fixtures.emptyStringJson ,fixtures.emptyStringJson
        describe 'and i run validate()', ->
          it "shouldn't return any errors", ->
            result = bodyValidator.validate()
            assert.equal result.length, 0

  
  shared.shouldBehaveLikeAmandaToGavel(JsonExample)
