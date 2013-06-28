{assert}       = require('chai')

fixtures       = require '../fixtures'
{Validator}    = require('../../src/validator')
{ValidationErrors}    = require('../../src/validation-errors')

describe 'Validator', ->
  validator = null


  describe 'when i create new instance of validator', ->

    before ->
      validator = new Validator data: fixtures.sampleJsonComplexKeyMissing ,schema: fixtures.sampleJsonSchemaNonStrict

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
      before ->
        validatorReturn = validator.validate()

      it 'should return correct formated errors', ->
        assert.deepEqual JSON.parse(JSON.stringify validatorReturn) , JSON.parse(fixtures.sampleFormatedError)

      it 'should set @errors', ->
        assert.isTrue validator.errors instanceof ValidationErrors

      it 'should set @amandaErrors', ->
        assert.deepEqual JSON.parse(JSON.stringify validator.amandaErrors), JSON.parse(fixtures.sampleAmandaError2)

      it 'should set @formatedErrors', ->
        assert.deepEqual JSON.parse(JSON.stringify validator.formatedErrors) , JSON.parse(fixtures.sampleFormatedError)

      describe 'when i change data', ->
        before ->
          validator.data = fixtures.sampleJson

        describe 'and run validate again', ->
          validatorReturnAfterDataChanged = null
          before ->
            validatorReturnAfterDataChanged = validator.validate()

          it 'errors should change', ->
            assert.isNull validatorReturnAfterDataChanged

      describe 'when i change schema', ->
        before ->
          validator.schema = JSON.parse fixtures.sampleJsonSchemaNonStrict2

        describe 'and run validate again', ->
          validatorReturnAfterDataChanged = null
          before ->
            validatorReturnAfterDataChanged = validator.validate()

          it 'errors should change', ->
            assert.isNotNull validatorReturnAfterDataChanged

