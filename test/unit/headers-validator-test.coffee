{assert} = require('chai')
{HeadersValidator} = require('../../src/validators/headers-validator')
fixtures = require '../fixtures'

describe 'HeadersValidator', ->
  headersValidator = {}
  describe 'constructor', ->
    describe 'when I provide malformed real data', ->
      it 'should throw exception', ->
        fn = () ->
          headersValidator = new HeadersValidator real: 'malformed',expected: {'header1': 'value1'}, schema: null
        assert.throws fn

    describe 'when I provide malformed expected data', ->
      it 'should throw exception', ->
        fn = () ->
          headersValidator = new HeadersValidator real: {'header1': 'value1'},expected: 'malformed', schema: null
        assert.throws fn

    describe 'when I provide malformed schema', ->
      it 'should throw exception', ->
        fn = () ->
          headersValidator = new HeadersValidator real: {'header1': 'value1'},expected: {'header1': 'value1'}, schema: 'malformed'
        assert.throws fn

    describe 'when I do not provide schema or expected', ->
      it 'should throw exception', ->
        fn = () ->
          headersValidator = new HeadersValidator real: {'header1': 'value1'},expected: null, schema: null
        assert.throws fn

    describe 'when I provide correct data', ->
      it 'should not throw exception', ->
        fn = () ->
          headersValidator = new HeadersValidator real: {'header1': 'value1'},expected: {'header1': 'value1'}, schema: {'header1': 'value1'}
        assert.doesNotThrow fn

    describe 'when I do not provide schema', ->
      before ->
        headersValidator = new HeadersValidator real: {'header1': 'value1'},expected: {'header1': 'value1'}, schema: null

      it 'correct schema should be generated', ->
        assert.deepEqual headersValidator.schema, JSON.parse fixtures.sampleHeadersSchema

    describe 'when provided real and expected headers are the same', ->
      before ->
        headersValidator = new HeadersValidator real: fixtures.sampleHeaders ,expected: fixtures.sampleHeaders, schema: null
      describe 'and i run validate()', ->
        it "shouldn't return any errors", ->
          result = headersValidator.validate()
          assert.equal result.length, 0

    describe 'when key is missing in provided headers', ->
      before ->
        headersValidator = new HeadersValidator real: fixtures.sampleHeadersMissing ,expected: fixtures.sampleHeaders, schema: null
      describe 'and i run validate()', ->
        it "should return 2 errors", ->
          result = headersValidator.validate()
          assert.equal result.length, 2

    describe 'when value in provided headers differs', ->
      before ->
        headersValidator = new HeadersValidator real: fixtures.sampleHeadersDiffers ,expected: fixtures.sampleHeaders, schema: null
      describe 'and i run validate()', ->
        it "should return 1 errors", ->
          result = headersValidator.validate()
          assert.equal result.length, 1

    describe 'when key is added to provided headers', ->
      before ->
        headersValidator = new HeadersValidator real: fixtures.sampleHeadersAdded ,expected: fixtures.sampleHeaders, schema: null
      describe 'and i run validate()', ->
        it "shouldn't return any errors", ->
          result = headersValidator.validate()
          assert.equal result.length, 0




