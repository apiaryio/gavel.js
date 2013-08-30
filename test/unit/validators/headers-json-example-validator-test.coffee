{assert} = require('chai')
{HeadersJsonExample} = require('../../../src/validators/headers-json-example')
fixtures = require '../../fixtures'
shared = require '../support/amanda-to-gavel-shared'

describe 'HeadersJsonExample', ->
  headersValidator = {}
  describe 'constructor', ->
    describe 'when I provede real data as non obejct', () ->
      it 'should throw an exception', () ->
        fn = () ->
          headersValidator = new HeadersJsonExample "", {'header1': 'value1'}
        assert.throw fn, "is not an Object"
    
    describe 'when I provede expected data as non obejct', () ->
      it 'should throw an exception', () ->
        fn = () ->
          headersValidator = new HeadersJsonExample {'header1': 'value1'}, ""
        assert.throw fn, "is not an Object"
    
    describe 'when I provide correct data', ->
      it 'should not throw an exception', ->
        fn = () ->
          headersValidator = new HeadersJsonExample {'header1': 'value1'}, {'header1': 'value1'}
        assert.doesNotThrow fn

    describe 'when provided real and expected headers are the same', ->
      before ->
        headersValidator = new HeadersJsonExample fixtures.sampleHeaders , fixtures.sampleHeaders
      describe 'and i run validate()', ->
        it "shouldn't return any errors", ->
          result = headersValidator.validate()
          assert.equal result.length, 0

    describe 'when key is missing in provided headers', ->
      before ->
        headersValidator = new HeadersJsonExample fixtures.sampleHeadersMissing , fixtures.sampleHeaders
      describe 'and i run validate()', ->
        it "should return 2 errors", ->
          result = headersValidator.validate()
          assert.equal result.length, 2

    describe 'when value in provided headers differs', ->
      before ->
        headersValidator = new HeadersJsonExample fixtures.sampleHeadersDiffers , fixtures.sampleHeaders
      describe 'and i run validate()', ->
        it "should return 1 errors", ->
          result = headersValidator.validate()
          assert.equal result.length, 1

    describe 'when key is added to provided headers', ->
      before ->
        headersValidator = new HeadersJsonExample fixtures.sampleHeadersAdded , fixtures.sampleHeaders
      describe 'and i run validate()', ->
        it "shouldn't return any errors", ->
          result = headersValidator.validate()
          assert.equal result.length, 0

    describe 'when Date or Expires values header differs', ->
      before ->
        headersValidator = new HeadersJsonExample fixtures.sampleHeadersWithDateAndExpiresChanged,  fixtures.sampleHeadersWithDateAndExpires
      describe 'and i run validate()', ->
        it "shouldn't return any errors", ->
          result = headersValidator.validate()
          assert.equal result.length, 0
  
  describe '#validate()', () ->
    output = null
    before () ->
      headersValidator = new HeadersJsonExample fixtures.sampleHeadersMissing , fixtures.sampleHeaders    
      output = headersValidator.validate()
    
    it 'should set validation data to output property', () ->
      assert.isDefined headersValidator.output
    
    it 'should return an obejct', () ->
      assert.isObject output
  
  shared.shouldBehaveLikeAmandaToGavel(HeadersJsonExample)
