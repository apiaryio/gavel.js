{assert}       = require('chai')

fixtures       = require '../../fixtures'
{TextDiff}    = require '../../../src/validators/text-diff'
{ValidationErrors}    = require('../../../src/validators/validation-errors')
DiffMatchPatch = require 'googlediff'

describe 'TextDiff', ->
  validator = null

  describe 'when i create new instance of validator with incorrect "data" (first argument)', ->
    validator = null

    it 'should throw exception', ->
      fn = () ->
        validator = new TextDiff null, ''
      assert.throws fn

  describe 'when i create new instance of validator with incorrect "expected" (second argument)', ->
    validator = null

    it 'should throw exception', ->
      fn = () ->
        validator = new TextDiff '', null
      assert.throws fn

  describe 'when i create new instance of validator with "Iñtërnâtiônàlizætiøn☃" string as "data"', ->
    validator = null

    it "should not throw exception", ->
      fn = () ->
        validator = new TextDiff 'Iñtërnâtiônàlizætiøn☃', ""
      assert.doesNotThrow fn

    describe 'when I run validate', ->
      it "should not throw exception", ->
        fn = () ->
          validator.validate()
        assert.doesNotThrow fn


  describe 'when i create new instance of validator with surrogate pair in data', ->
    validator = null

    it "should not throw exception", ->
      fn = () ->
        validator = new TextDiff "text1\uD800", "\uD800text1"
      assert.doesNotThrow fn

    describe 'when  I run validate', ->
      it "should not throw exception", ->
        fn = () ->
          validator.validate()
        assert.doesNotThrow fn


  describe 'when i create new instance of validator with correct data', ->
    validator = null

    it 'should not throw exception', ->
      fn = () ->
        validator = new TextDiff 'text1', 'text1'
      assert.doesNotThrow fn

    describe 'when data are same and I run validate', ->
      validationResult = null
      before ->
        validator = new TextDiff 'text1', 'text1'
        validationResult = validator.validate()

      it 'should set output property', ->
        assert.isDefined validator.output

      it 'output should be a string', ->
        assert.isString validator.output

      it 'output should be empty string', ->
        assert.equal validator.output, '' 


    describe 'when data differs and I run validate', ->
      validationResult = null
      before ->
        validator = new TextDiff 'text1', 'text2'
        validationResult = validator.validate()

      it 'output property should be a string', ->
        assert.isString validator.output
      
      it 'output property should not be empty string', () ->
        assert.notEqual validator.output, ""

      it 'output property should contain + and -', () ->
        assert.include validator.output, '-'
        assert.include validator.output, '+'

      it 'output property should be persed by googlediff to an array', () ->
        dmp = new DiffMatchPatch
        assert.isArray dmp.patch_fromText validator.output
  
  describe '.evaluateOutputToResults', () ->
    data = null
    results = null
    
    describe 'empty validation result', () ->
      before () ->
        validator = new TextDiff '',''
        validator.validate()
        results = validator.evaluateOutputToResults()
      
      it 'should return an array', () ->
        assert.isArray results    
      
      it 'should has no results', () ->
        assert.equal results.length, 0

    describe 'non empty validation result', () ->
      before () ->
        validator = new TextDiff 'abc','cde'
        validator.validate()
        results = validator.evaluateOutputToResults()
      
      it 'should return an array', () ->
        assert.isArray results

      it 'should contain message with error severity', () ->
        haystack = []
        results.forEach (result) ->
          haystack.push result.severity
            
        assert.include haystack, 'error' 






