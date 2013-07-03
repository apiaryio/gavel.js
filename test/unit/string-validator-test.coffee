{assert}       = require('chai')

fixtures       = require '../fixtures'
{StringValidator}    = require('../../src/validators/string-validator')
{ValidationErrors}    = require('../../src/validators/validation-errors')

describe 'StringValidator', ->
  validator = null

  describe 'when i create new instance of validator with incorrect data', ->
    validator = null

    it 'should throw exception', ->
      fn = () ->
        validator = new StringValidator string1: {}, string2: {}
      assert.throws fn

  describe 'when i create new instance of validator with correct data', ->
    validator = null

    it 'should not throw exception', ->
      fn = () ->
        validator = new StringValidator string1: 'text1', string2: 'text1'
      assert.doesNotThrow fn

    describe 'when data are same and I run validate', ->
      validationResult = null
      before ->
        validationResult = validator.validate()

      it 'there should not be any errors', ->
        assert.equal validationResult.length, 0

    describe 'when data differs and I run validate', ->
      validationResult = null
      before ->
        validator.string1 = 'different string'
        validationResult = validator.validate()

      it 'there should be 1 error from string validator', ->
        assert.equal validationResult.length, 1
        assert.equal validationResult[0].validatorName, 'string'


