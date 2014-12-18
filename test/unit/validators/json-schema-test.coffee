{assert} = require 'chai'
fixtures = require '../../fixtures'
{JsonSchema} = require '../../../src/validators/json-schema'
{ValidationErrors}    = require '../../../src/validators/validation-errors'
sinon = require 'sinon'
shared = require '../support/amanda-to-gavel-shared'

describe 'JsonSchema', ->
  validator = null

  dataForTypes =
    string:
      real: fixtures.sampleJsonComplexKeyMissing
      schema: fixtures.sampleJsonSchemaNonStrict
    object:
      real: JSON.parse fixtures.sampleJsonComplexKeyMissing
      schema: JSON.parse fixtures.sampleJsonSchemaNonStrict

  types = Object.keys dataForTypes
  types.forEach (type) ->

    data = dataForTypes[type]

    describe 'when i create new instance of validator with "' + type + '" type arguments', ->
      validator = null

      it 'should not throw an exception', ->
        fn = () ->
          validator = new JsonSchema data['real'], data['schema']
        assert.doesNotThrow fn

      it 'should set data to object', ->
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
            validator.data = JSON.parse fixtures.sampleJson

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

    shared.shouldBehaveLikeAmandaToGavel(new JsonSchema '{}','{}')

  describe 'when validation performed on real empty object', () ->
    it 'should return some errors', ->
      validator = new JsonSchema {}, JSON.parse fixtures.sampleJsonSchemaNonStrict
      result = validator.validate()
      assert.notEqual validator.validate().length, 0

  it 'should have validateSchema method', () ->
    validator = new JsonSchema {},{}
    assert.isDefined validator.validateSchema

  describe 'when I create new instance', () ->
    it 'should call validateSchema', () ->
      sinon.spy JsonSchema.prototype, 'validateSchema'
      validator = new JsonSchema {}, {}
      assert.isTrue validator.validateSchema.called

  describe 'validateSchema', () ->
    describe 'when invalid schema provided', () ->
      it 'should throw an error', () ->
        invalidSchema = require '../../fixtures/invalid-schema'
        fn = () ->
          validator = new JsonSchema {}, invalidSchema
        assert.throw fn

    describe 'when valid schema provided', () ->
      it 'should not throw any error', () ->
        validSchema = require '../../fixtures/valid-schema'
        fn = () ->
          validator = new JsonSchema {}, validSchema
        assert.doesNotThrow fn


