{assert} = require('chai')
{HeadersJsonExample} = require('../../../src/validators/headers-json-example')
fixtures = require '../../fixtures'
jsonPointer = require 'json-pointer'

describe 'HeadersJsonExample', ->
  headersValidator = {}
  describe 'constructor', ->
    describe 'when I provide malformed real data', ->
      it 'should throw exception', ->
        fn = () ->
          headersValidator = new HeadersJsonExample 'malformed', {'header1': 'value1'}
        assert.throws fn

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
  
  describe '.evaluateOutputToResults()', () ->
    output = null
    
    describe 'if data is null', () ->
      before () ->
        data = null
        output = HeadersJsonExample.evaluateOutputToResults data
      it 'should set no messages to results', () ->
        assert.equal output.length, 0

    describe 'if data is Tully\'s sanitized pseudo amanda error with length 0', () ->
      before () ->
        data = fixtures.emptyAmandaError
    
    describe 'if data is an amanda error', () ->
      before () ->
        data = JSON.parse fixtures.sampleAmandaError
        output = HeadersJsonExample.evaluateOutputToResults data
      
      it 'should return an array', () ->
        assert.isArray output
      
      describe 'first element in results array', () ->
        item = null
        before () ->
          item = output[0]
        
        it 'should be an object', () ->
          assert.isObject item
        
        ['message', 'severity', 'pointer'].forEach (key) ->
          it 'should have "' + key + '"', () ->
            assert.include Object.keys(item), key
        
        describe 'pointer key value', () ->
          value = null
          before () ->
            value = item['pointer']
          
          it 'should be a string', () ->
            assert.isString value

          it 'should be a parseable JSON poitner', () ->
            parsed = jsonPointer.parse value
            
            assert.isArray parsed

