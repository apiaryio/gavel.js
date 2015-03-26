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

      beforeEach () ->
        validator = new JsonSchema data['real'], data['schema']

      it 'should not throw an exception', ->
        fn = () ->
          new JsonSchema data['real'], data['schema']
        assert.doesNotThrow fn

      it 'should set data to object', ->
        assert.equal typeof validator.data, 'object'

      it 'should parse data to object which is json parsable', ->
        assert.doesNotThrow () -> JSON.stringify validator.data

      it 'should parse schema to object', ->
        assert.equal typeof validator.schema, 'object'

      it 'should parse schema to object which is json parsable', ->
        assert.doesNotThrow () -> JSON.stringify validator.schema

      describe 'when I run validate()', ->
        validatorReturn = null
        validatorReturnAgain = null
        validatorReturnAfterDataChanged = null

        beforeEach ->
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

  describe 'when invalid JSON-stringified-data are provided', ->
    invalidStringifiedSchema = null
    before ->
      invalidStringifiedSchema = require '../../fixtures/invalid-stringified-schema'

    it 'should throw an error for "data"', () ->
      fn = () ->
        validator = new JsonSchema invalidStringifiedSchema
      assert.throw fn

    it 'should throw an error for "schema"', () ->
      invalidStringifiedSchema = require '../../fixtures/invalid-stringified-schema'
      fn = () ->
        validator = new JsonSchema {}, invalidStringifiedSchema
      assert.throw fn


  describe 'validate an object to check json_schema_options passed to Amanda', ->
    results = null
    error = null
    messagesLength = null

    before ->
      messagesLength = Object.keys(fixtures.sampleJsonBodyTestingAmandaMessages).length
      validator = new JsonSchema fixtures.sampleJsonBodyTestingAmandaMessages, fixtures.sampleJsonSchemaTestingAmandaMessages
      results = validator.validate()

    it "contains all those schema defined messages", ->
      assert.isNull error
      assert.isObject results
      assert.lengthOf Object.keys(fixtures.sampleJsonSchemaTestingAmandaMessages.properties), messagesLength
      assert.propertyVal results, 'length', messagesLength
      assert.lengthOf results, messagesLength


  describe 'validateSchema', () ->
    describe 'with schema v3', () ->
      describe 'when invalid schema provided', () ->
        fn = null
        before () ->
          invalidSchema = require '../../fixtures/invalid-schema-v3'
          fn = () ->
            validator = new JsonSchema {}, invalidSchema

        it 'should throw an error', () ->
          assert.throw fn

        it 'should mention schema v3 in the message', () ->
          try
            fn()
          catch e
            assert.include e.message, 'v3'

      describe 'when valid v3 schema provided', () ->
        fn = null
        before () ->
          validSchema = require '../../fixtures/valid-schema-v3'
          fn = () ->
            validator = new JsonSchema {}, validSchema

        it 'should not throw any error', () ->
          assert.doesNotThrow fn

        it 'should set @jsonSchemaVersion to v3', () ->
          fn()
          assert.equal validator.jsonSchemaVersion, 'v3'

    describe 'with schema v4', () ->
      describe 'when invalid v4 schema provided', () ->
        fn = null
        before () ->
          invalidSchema = require '../../fixtures/invalid-schema-v4'
          fn = () ->
            validator = new JsonSchema {}, invalidSchema

        it 'should throw an error', () ->
          assert.throw fn

        it 'should mention v4 in the error message', () ->
          try
            fn()
          catch e
            assert.include e.message, 'v4'

      describe 'when valid v4 schema provided', () ->
        fn = null
        before () ->
          validSchema = require '../../fixtures/valid-schema-v4'
          fn = () ->
            validator = new JsonSchema {}, validSchema

        it 'should not throw any error', () ->
          assert.doesNotThrow fn

        it 'should set @jsonSchemaVersion to v4', () ->
          fn()
          assert.equal validator.jsonSchemaVersion, 'v4'

      describe 'with not identified version of schema', () ->
        describe 'valid against v3 metaschema', () ->
          fn = null
          before () ->
            validSchema = require '../../fixtures/valid-schema-v3'
            delete validSchema['$schema']
            fn = () ->
              validator = new JsonSchema {}, validSchema

          it 'should not throw any error', () ->
            assert.doesNotThrow fn

          it 'should set @jsonSchemaVersion to v3', () ->
            fn()
            assert.equal validator.jsonSchemaVersion, 'v3'

        describe 'valid against v4 metaschema', () ->
          fn = null
          before () ->
            validSchema = require '../../fixtures/valid-schema-v4'
            delete validSchema['$schema']
            fn = () ->
              validator = new JsonSchema {}, validSchema

          it 'should not throw any error', () ->
            assert.doesNotThrow fn

          it 'should set @jsonSchemaVersion to v4', () ->
            fn()
            assert.equal validator.jsonSchemaVersion, 'v4'


        describe 'not valid against any metaschema', () ->
          fn = null
          before () ->
            validSchema = require '../../fixtures/invalid-schema-v3-v4'
            delete validSchema['$schema']
            fn = () ->
              validator = new JsonSchema {}, validSchema

          it 'should throw an error', () ->
            assert.throw fn

          it 'should metion both v3 and v4 in the error message', () ->
            try
              fn()
            catch e
              assert.include e.message, 'v3'
              assert.include e.message, 'v4'


describe 'validatePrivate()', () ->
  describe 'when @jsonSchemaVersion is set to v3', () ->
    validator = null

    before () ->
      validSchema = require '../../fixtures/valid-schema-v3'
      delete validSchema['$schema']
      validator = new JsonSchema {}, validSchema

      sinon.stub validator, 'validateSchemaV3'
      sinon.stub validator, 'validateSchemaV4'
      validator.jsonSchemaVersion = 'v3'

      validator.validatePrivate()

    after () ->
      validator.validateSchemaV3.restore()
      validator.validateSchemaV4.restore()

    it 'should validate using Amanda', () ->

      assert.ok validator.validateSchemaV3.called

    it 'should not valiate using tv4', () ->
      assert.notOk validator.validateSchemaV4.called


  describe 'when @jsonSchemaVersion is set to v4', () ->
    validator = null

    before () ->
      validSchema = require '../../fixtures/valid-schema-v4'
      delete validSchema['$schema']
      validator = new JsonSchema {}, validSchema

      sinon.stub validator, 'validateSchemaV3'
      sinon.stub validator, 'validateSchemaV4'

      validator.jsonSchemaVersion = 'v4'

      validator.validatePrivate()

    after () ->
      validator.validateSchemaV3.restore()
      validator.validateSchemaV4.restore()

    it 'should validate using tv4', () ->
      assert.ok validator.validateSchemaV4.called

    it 'should not validate using amanda', () ->
      assert.notOk validator.validateSchemaV3.called

  describe 'when @jsonSchemaVersion is null', () ->
    fn = null
    validator = null

    beforeEach () ->
      validSchema = require '../../fixtures/valid-schema-v3'
      delete validSchema['$schema']
      fn = () ->
        validator = new JsonSchema {}, validSchema
        validator.jsonSchemaVersion = null
        validator.validatePrivate()

    it 'shuold throw an error', () ->
      assert.throw fn

    it 'should let know in the error message that it should not happen', () ->
      try
        fn()
      catch e
        assert.include e.message, "JSON schema version not identified, can't validate!"
