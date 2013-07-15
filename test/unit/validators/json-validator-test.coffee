{assert}       = require('chai')

fixtures       = require '../../fixtures'
{JsonValidator}    = require('../../../src/validators/json-validator')
{ValidationErrors}    = require('../../../src/validators/validation-errors')

describe 'JsonValidator', ->
  validator = null

  describe 'when i create new instance of validator with incorrect data', ->
    validator = null

    it 'should throw exception', ->
      fn = () ->
        validator = new JsonValidator data: fixtures.sampleJsonComplexKeyMissing ,schema: fixtures.sampleJsonSchemaNonStrict
      assert.throws fn

  describe 'when i create new instance of validator with correct data', ->
    validator = null

    it 'should not throw exception', ->
      fn = () ->
        validator = new JsonValidator data: JSON.parse(fixtures.sampleJsonComplexKeyMissing) ,schema: JSON.parse(fixtures.sampleJsonSchemaNonStrict)
      assert.doesNotThrow fn

    it 'should parse data to object', ->
      assert.equal typeof validator.data, 'object'

    it 'should parse data to object which is json parsable', ->
      assert.doesNotThrow () -> JSON.stringify validator.data

    it 'should parse schema to object', ->
      assert.equal typeof validator.schema, 'object'

    it 'should parse schema to object which is json parsable', ->
      assert.doesNotThrow () -> JSON.stringify validator.schema

    describe 'when I run validate', ->
      validatorReturn = null
      validatorReturnAgain = null
      validatorReturnAfterDataChanged = null
      before ->
        validatorReturn = validator.validate()

      it 'should set @errors', ->
        assert.isTrue validator.errors instanceof ValidationErrors

      it 'should return some errors', ->
        assert.notEqual validatorReturn.length , 0

      describe 'and run validate again', ->
        before ->
          validatorReturnAgain = validator.validate()

        it 'errors should not change', ->
          assert.deepEqual JSON.parse(JSON.stringify(validatorReturnAgain)), JSON.parse(JSON.stringify(validatorReturn))

      describe 'when i change data', ->
        before ->
          validator.data = fixtures.sampleJson

        describe 'and run validate again', ->

          before ->
            validatorReturnAfterDataChanged = validator.validate()

          it 'errors should change', ->
            assert.equal validatorReturnAfterDataChanged.length, 0

      describe 'when i change schema', ->
        before ->
          validator.schema = JSON.parse fixtures.sampleJsonSchemaNonStrict2

        describe 'and run validate again', ->
          validatorReturnAfterDataChanged2 = null
          before ->
            validatorReturnAfterDataChanged2 = validator.validate()

          it 'errors should change', ->
            assert.notDeepEqual JSON.parse(JSON.stringify(validatorReturnAfterDataChanged2)), JSON.parse(JSON.stringify(validatorReturnAfterDataChanged))

