chai = require('chai')
sinon = require('sinon')

assert = chai.assert

{HttpResponse} = require('../../../src/model/http-response')
{HttpRequest} = require('../../../src/model/http-request')
fixtures = require '../../fixtures'
validators = require '../../../src/validators'

describe "Http validatable mixin", () ->

  describe "when mixed in any HTTP Message class", () ->

    methods = [
      'isValidatable'
      'validate'
      'isValid'
      'validationResults'

      'lowercaseHeaders'

      'validateHeaders'
      'setHeadersRealType'
      'setHeadersExpectedType'
      'setHeadersValidator'
      'runHeadersValidator'

      'validateBody'
      'setBodyRealType'
      'setBodyExpectedType'
      'setBodyValidator'
      'runBodyValidator'

      'validateStatusCode'
    ]

    methods.forEach (method) ->
      it 'should have ' + method + ' method defined', () ->
        assert.isFunction HttpResponse.prototype[method]

  describe "validatableComponents", () ->

    ['headers','body', 'statusCode'].forEach (item) ->
      it 'should contain "' + item + '"', () ->
        instance = new HttpResponse {}
        assert.include instance.validatableComponents, item

  describe "#isValidatable()", () ->
    describe 'when no validatable HTTP component in the object', () ->
      it 'should return false', () ->
        instance = new HttpResponse {foo: 'bar'}
        assert.isFalse instance.isValidatable()

    describe 'when any validatable HTTP component is present in the object', ->
      it 'should return true for some headers', ->
        instance = new HttpResponse {headers: {'content-type:': 'application/json'}}
        assert.isTrue instance.isValidatable()

      it 'should return true for some body', ->
        instance = new HttpResponse {body: ''}
        assert.isTrue instance.isValidatable()

      it 'should return true for some statusCode', ->
        instance = new HttpResponse {statusCode: 200}
        assert.isTrue instance.isValidatable()

  describe "any HTTP Message instance", () ->
    instance = {}
    response =
      body: '{"a": "b"}'
      headers:
        fixtures.sampleHeadersMissing
      statusCode: 200
      expected:
        headers: fixtures.sampleHeaders
        body: '{"b": "c"}'

    before () ->
      instance = new HttpResponse response


    describe "#validate()", () ->
      result = null
      before () ->
        result = instance.validate()

      it 'should return an object', () ->
        assert.isObject result

      ['headers', 'body', 'statusCode', 'version'].forEach (key) -> do (key) ->
        it 'should contain validatable Component key "' + key + '"', () ->
          assert.include Object.keys(result), key

      it "should create validation property", () ->
        assert.isDefined instance.validation

      # Headers
      it 'should call lowercaseHeaders', () ->
        instance = new HttpResponse response
        sinon.spy instance, 'lowercaseHeaders'
        instance.validate()
        assert.isTrue instance.lowercaseHeaders.called

      describe 'real headers are present', () ->
        before () ->
          instance = new HttpResponse response
          sinon.spy instance, 'validateHeaders'
          instance.validate()

        it "should call validateHeaders", () ->
          assert.isTrue instance.validateHeaders.called

      describe 'when expected headers not present', () ->
        before () ->
          instance = new HttpResponse response
          sinon.spy instance, 'validateHeaders'
          instance.expected.headers = undefined
          instance.validate()

        it 'should not run headers validation', () ->
          assert.isFalse instance.validateHeaders.called

      describe 'when expected headers are present', () ->
        before () ->
          instance = new HttpResponse response
          sinon.spy instance, 'validateHeaders'
          instance.validate()

        it "should call validateHeaders", () ->
          assert.isTrue instance.validateHeaders.called

      describe 'when real headers not present', () ->
        before () ->
          instance = new HttpResponse response
          sinon.spy instance, 'validateHeaders'
          instance.headers = undefined
          instance.validate()

        it 'should not run headers validation', () ->
          assert.isFalse instance.validateHeaders.called


      # Body
      describe 'when real body is present', () ->
        before () ->
          instance = new HttpResponse response
          sinon.spy instance, 'validateBody'
          instance.validate()

        it "should call validateBody", () ->
          assert.isTrue instance.validateBody.called

      describe 'when real is not present', () ->
        before () ->
          instance = new HttpResponse response
          sinon.spy instance, 'validateBody'
          instance.body = undefined
          instance.validate()

        it 'should not run body validation', () ->
          assert.isFalse instance.validateBody.called

      describe 'when expected body is present', () ->
        before () ->
          instance = new HttpResponse response
          instance.expected.body = '{"b": "c"}'
          sinon.spy instance, 'validateBody'
          instance.validate()

        it "should call validateBody", () ->
          assert.isTrue instance.validateBody.called

      describe 'when expected body is not present', () ->
        before () ->
          instance = new HttpResponse response
          sinon.spy instance, 'validateBody'
          instance.expected.body = undefined
          instance.validate()

        it 'should not run body validation', () ->
          assert.isFalse instance.validateBody.called

    describe "#isValid()", () ->
      before () ->
        instance = new HttpResponse response
        sinon.spy instance, 'validate'
      describe "validation property is empty", () ->
        it "should perform validation",() ->
          instance.isValid()
          assert.isTrue instance.validate.called

      it 'should return boolean', () ->
        assert.isBoolean instance.isValid()

      describe "when any HTTP component contains error message", () ->
        i = null
        before () ->
          i = new HttpResponse {}
          i.validation =
            headers:
              results: [
                { severity: 'error' }
              ]

        it "should return false", () ->
          assert.isFalse i.isValid()


    describe "#validationResults()", () ->
      describe "when HTTP message validation property is empty", () ->
        before () ->
          instance = new HttpResponse response
          sinon.spy instance, 'validate'

        it "should perform validation", () ->
          instance.validationResults()
          assert.isTrue instance.validate.called


        it "should return content of validation property", () ->
          validation = {booboo: 'foobar'}
          instance.validation = validation
          assert.equal instance.validationResults(), validation

    describe "#lowercaseHeaders()", () ->
      inst = null
      before () ->
        inst = new HttpRequest {
          headers:
            'Content-Type': 'application/json; charset=utf-8'
            'User-Agent': 'Dredd/0.3.5 (Darwin 13.2.0; x64)'

          expected:
            headers:
              'CONTENT-TYPE': 'application/json; charset=utf-8'
              'USER-AGENT': 'Dredd/0.3.5 (Darwin 13.2.0; x64)'
        }
        inst.lowercaseHeaders()

      it 'should convert all keys in real headers object to lowercase', () ->
        keys = Object.keys inst.headers
        assert.include keys, 'content-type'
        assert.include keys, 'user-agent'
        assert.notInclude keys, 'Content-Type'
        assert.notInclude keys, 'User-Agebt'

      it 'should convert all keys in expected headers object to lowercase', () ->
        keys = Object.keys inst.expected.headers
        assert.include keys, 'content-type'
        assert.include keys, 'user-agent'
        assert.notInclude keys, 'Content-Type'
        assert.notInclude keys, 'User-Agent'

    # Headers validation tests

    describe "#validateHeaders()", () ->
      before () ->
        sinon.spy instance, 'setHeadersRealType'
        sinon.spy instance, 'setHeadersExpectedType'
        sinon.spy instance, 'setHeadersValidator'
        sinon.spy instance, 'runHeadersValidator'

        instance.validateHeaders()

      fields = [
        'realType'
        'expectedType'
        'validator'
        'rawData'
        'results'
      ]

      fields.forEach (field) -> do (field) ->
        it "should set '" + field + "' property for the component", () ->
          assert.isDefined instance.validation.headers[field]

      it 'should call setHeadersRealType', () ->
        assert.isTrue instance.setHeadersRealType.called

      it 'should call setHeadersExpectedType', () ->
        assert.isTrue instance.setHeadersExpectedType.called

      it 'should call setHeadersValidator', () ->
        assert.isTrue instance.setHeadersValidator.called

      it 'should call runHeadersValidator', () ->
        assert.isTrue instance.runHeadersValidator.called


    describe "#setHeadersRealType()", ->

      describe "real is an Object", () ->
        before () ->
          instance.validation.headers = {}
          instance.setHeadersRealType()

        it "should set realType", () ->
          assert.equal instance.validation.headers.realType, "application/vnd.apiary.http-headers+json"

      describe "real is not an Object", () ->
        before () ->
          instance.headers = "string"
          instance.setHeadersRealType()

        it "should set real type to null", () ->
          assert.equal instance.validation.headers.realType, null

    describe "#setHeadersExpectedType()", () ->
      describe 'expected headers property is an Object', () ->
        before () ->
          instance.validation.headers = {}
          instance.setHeadersExpectedType()

        it "should set expectedType", () ->
          assert.equal instance.validation.headers.expectedType, "application/vnd.apiary.http-headers+json"

      describe 'expectedheaders property is not an Object', () ->
        before () ->
          instance.expected.headers = "string"
          instance.setHeadersExpectedType()

        it "should let expected type empty", () ->
          assert.equal instance.validation.headers.expectedType, null

    describe "#setHeadersValidator()", ->
      before () ->
        instance.validation = {}
        instance.validation.headers = {}
        instance.setHeadersValidator()

      it "should set validator property", () ->
        assert.isDefined instance.validation.headers.validator

      describe "real and expected type is application/vnd.apiary.http-headers+json", () ->
        before () ->
          instance.validation.headers =
            realType: "application/vnd.apiary.http-headers+json"
            expectedType: "application/vnd.apiary.http-headers+json"

          instance.setHeadersValidator()

        it "should set HeadersJsonExample validator", () ->
          assert.equal instance.validation.headers.validator, 'HeadersJsonExample'

      describe "unknown media type combination", () ->
        before () ->
          instance.validation.headers =
            realType: ""
            expectedType: ""

          instance.setHeadersValidator()

        it "should set results to array", () ->
          assert.isArray instance.validation.headers.results

        it "should set validator to null", () ->
          assert.equal instance.validation.headers.validator, null

        it 'should add some message to results', () ->
          assert.isTrue instance.validation.headers.results.length > 0

        describe 'added message', () ->
          message = null

          before () ->
            index = instance.validation.headers.results.length - 1
            message = instance.validation.headers.results[index]

          it 'should have error severity', () ->
            assert.equal message['severity'], 'error'


    describe "#runHeadersValidator", () ->
      describe "if available validator" , () ->
        before () ->
          instance = new HttpResponse response
          instance.validation = {}
          instance.validation.headers = {}

          instance.expected.headers = fixtures.sampleHeaders
          instance.validation.headers.validator = 'HeadersJsonExample'
          instance.runHeadersValidator()

        it 'should set rawData property', () ->
          assert.isDefined instance.validation.headers.rawData

        it 'rawData should not be null', () ->
          assert.isNotNull instance.validation.headers.rawData

      describe "if no validator available", () ->
        before () ->
          instance = new HttpResponse response
          instance.validation = {}
          instance.validation.headers = {}

          instance.expected.headers = fixtures.sampleHeaders
          instance.validation.headers.validator = null
          instance.runHeadersValidator()

        it 'should let rawData null',() ->
          assert.isNull instance.validation.headers.rawData

    describe "#runHeadersValidator()", () ->
      before () ->
        instance = new HttpResponse response
        instance.validation = {}
        instance.validation.headers = {}

        instance.validation.headers.rawData = JSON.parse fixtures.sampleAmandaError
        instance.validation.headers.validator = 'HeadersJsonExample'

      describe 'any previously set results', () ->
        before () ->
          instance.validation.results = ['booboo']
          instance.runHeadersValidator()

        it 'should not overwrite existing results', () ->
          assert.include instance.validation.results, 'booboo'

        it 'should set results to an array', () ->
          assert.isArray instance.validation.headers.results

      describe 'no previous results', () ->
        before () ->
          instance.validation.headers.results = []
          instance.runHeadersValidator()

        it 'should set results to an array', () ->
          assert.isArray instance.validation.headers.results

        it 'should have 1 result', () ->
          assert.equal instance.validation.headers.results.length, 1

      describe 'no rawData and validator available', () ->
        before () ->
          instance.validation.headers.validator = null
          instance.validation.headers.rawData = null

        it 'should not throw an error', () ->
          fn = () ->
            instance.runHeadersValidator()

          assert.doesNotThrow fn




    # Body validation tests

    describe "#validateBody()", () ->
      before () ->
        sinon.spy instance, 'setBodyRealType'
        sinon.spy instance, 'setBodyExpectedType'
        sinon.spy instance, 'setBodyValidator'
        sinon.spy instance, 'runBodyValidator'

        instance.validateBody()

      fields = [
        'realType'
        'expectedType'
        'validator'
        'rawData'
        'results'
      ]

      fields.forEach (field) -> do (field) ->
        it "should set '" + field + "' property for the component", () ->
          assert.isDefined instance.validation.body[field]

      it 'should call setBodyRealType', () ->
        assert.isTrue instance.setBodyRealType.called

      it 'should call setBodyExpectedType', () ->
        assert.isTrue instance.setBodyExpectedType.called

      it 'should call setBodyValidator', () ->
        assert.isTrue instance.setBodyValidator.called

      it 'should call runBodyValidator', () ->
        assert.isTrue instance.runBodyValidator.called


    describe '#setBodyRealType()', () ->

      describe 'body is not a string', () ->
        before () ->
          instance = new HttpResponse {
            body: {}
          }
          instance.validation = {}
          instance.validation.body = {}
          instance.validation.body.results = []


        it 'should throw an error', () ->
          message = ""
          try
            instance.setBodyRealType()
          catch error
            message = error.message

          assert.include message, 'String'


      jsonContentTypes = [
        'application/json'
        'application/json; charset=utf-8'
        'application/hal+json'
      ]

      jsonContentTypes.forEach (contentType) -> do (contentType) ->

        describe "header content-type is '#{contentType}'", () ->
          instance = null
          before () ->
            instance = new HttpResponse {
              headers: {'content-type': contentType}
            }
            instance.validation = {}
            instance.validation.body = {}
            instance.validation.body.results = []

          describe 'body is a parseable JSON', () ->
            before () ->
              instance.body = '{"foo": "bar"}'
              instance.setBodyRealType()

            it 'should set real type to ' + contentType + '\'', () ->
              assert.equal instance.validation.body.realType,
                contentType


          describe 'body is not a parseable JSON', () ->
            before () ->
              instance.body = '{"creative?": false, \'creativ\': true }'
              instance.setBodyRealType()

            it 'should set realType to null', () ->
              assert.equal instance.validation.body.realType,
                null

            it 'should add error message to results with error severity', () ->
              results = instance.validation.body.results
              results.forEach (result) ->
                results.push result.severity

              assert.include results, 'error'

            it 'should add error message with lint result', () ->
              expected = "Parse error on line 1:\n...\"creative?\": false, 'creativ': true }\n-----------------------^\nExpecting 'STRING', got 'undefined'"
              messages = []
              for result in instance.validation.body.results
                messages.push result.message

              assert.include messages[0], expected

            it 'should not overwrite existing errors', () ->
              instance.validation.body.results = [
                {'message': 'Shit happen.', 'severity': 'error'}
              ]
              before = instance.validation.body.results.length
              instance.setBodyRealType()
              after = instance.validation.body.results.length
              assert.equal before + 1, after


      describe 'any or no content-type header', () ->
          before () ->
            instance = new HttpResponse {}
            instance.headers = undefined
            instance.validation = {}
            instance.validation.body = {}
            instance.validation.body.results = []

          describe 'body is a parseable json', () ->
            before () ->
              instance.body = '{"foo": "bar"}'
              instance.setBodyRealType()
            it 'should set real type to application/json', () ->
              assert.equal instance.validation.body.realType,
                'application/json'

          describe 'body is not a parseable json', () ->
            before () ->
              instance.body = 'Booboo foo bar john doe'
              instance.setBodyRealType()

            it 'should set real type to text/plain', () ->
              assert.equal instance.validation.body.realType,
                'text/plain'

    describe "#setBodyExpectedType()", () ->
      #describe 'expected headers property is an Object', () ->
        #before () ->
        #  instance.validation.headers = {}
        #  instance.setHeadersExpectedType()

      describe 'JSON Schema for expected body is provided', () ->
        instance = {}

        describe 'schema is an object', () ->
          describe 'it is not a valid JSON schema', () ->
            it 'should set warrning'
          describe 'it is a valid JSON schema', () ->
            before () ->
              instance = new HttpResponse {
                expected:
                  bodySchema: JSON.parse fixtures.sampleJsonSchema
              }
              instance.validation = {}
              instance.validation.body = {}
              instance.setBodyExpectedType()

            it 'should set expected type to application/schema+json', () ->
              assert.equal instance.validation.body.expectedType,
                'application/schema+json'

            it 'should set not error message to result', () ->
              assert.equal instance.validation.body.results.length, 0


        describe 'schema is a parseable JSON', () ->
          describe 'parsed JSON is a valid JSON Schema', () ->
            before () ->
              instance = new HttpResponse {
                expected:
                  bodySchema: fixtures.sampleJsonSchema
              }
              instance.validation = {}
              instance.validation.body = {}
              instance.setBodyExpectedType()

            it 'should set expected type to application/schema+json', () ->
              assert.equal instance.validation.body.expectedType,
                'application/schema+json'

            it 'should set not error message to result', () ->
              assert.equal instance.validation.body.results.length, 0

          describe 'parsed JSON is not an object', () ->
            before () ->
              instance = new HttpResponse {
                expected:
                  bodySchema: "0"
              }
              instance.validation = {}
              instance.validation.body = {}
              instance.setBodyExpectedType()

            it 'should set an error message to result', () ->
              results = instance.validation.body.results
              results.forEach (result) ->
                results.push result.severity

              assert.include results, 'error'

            it 'should set expected type to null', () ->
              assert.equal instance.validation.body.expectedType,
                null

          describe 'parsed JSON is not a valid JSON Schema', () ->
            it 'should set an error message to results'
            it 'should set expected type to null'

        describe 'schema is not a parseable JSON', () ->
          before () ->
            instance = new HttpResponse {
              expected:
                bodySchema: "{()}}"
            }
            instance.validation = {}
            instance.validation.body = {}
            instance.setBodyExpectedType()

          it 'should set error messages to results', () ->
            results = instance.validation.body.results
            results.forEach (result) ->
              results.push result.severity

            assert.include results, 'error'

          it 'should set expceted type to null', () ->
            assert.equal instance.validation.body.expectedType,
              null

      describe 'JSON Schema for expected body is not provided', () ->

        jsonContentTypes = [
          'application/json',
          'application/json; charset=utf-8'
          'application/hal+json'
        ]

        jsonContentTypes.forEach (contentType) ->

          describe "expected headers have content-type '#{contentType}'", () ->
            describe 'expected body is a parseable JSON', () ->
              before () ->
                instance = new HttpResponse {
                  expected:
                    headers:
                      'content-type': contentType
                    body: "{}"
                }
                instance.validation = {}
                instance.validation.body = {}
                instance.setBodyExpectedType()

              it 'should set expected type to ' + contentType, () ->
                assert.equal instance.validation.body.expectedType,
                  contentType

              it 'should set no error message to result', () ->
                assert.equal instance.validation.body.results.length, 0


            describe 'expected body is not a parseable JSON', () ->
              before () ->
                instance = new HttpResponse {
                  expected:
                    headers:
                      'content-type': contentType
                    body: '{"creative?": false, \'creativ\': true }'
                }

                instance.validation = {}
                instance.validation.body = {}
                instance.setBodyExpectedType()

              it 'should set an severity "error" item to results', () ->
                results = instance.validation.body.results
                severities = []
                results.forEach (result) ->
                  severities.push result.severity

                assert.include severities, 'error'

              it 'should set expected type to null', () ->
                assert.equal instance.validation.body.expectedType,
                  null

              it 'should set a descriptive message to results', () ->
                results = instance.validation.body.results
                messages = []

                results.forEach (result) ->
                  messages.push result.message

                assert.include messages[0], 'is not a parseable JSON'

              it 'should add error message with lint result', () ->
                expected = "Parse error on line 1:\n...\"creative?\": false, 'creativ': true }\n-----------------------^\nExpecting 'STRING', got 'undefined'"
                messages = []
                for result in instance.validation.body.results
                  messages.push result.message

                assert.include messages[0], expected

        describe 'expected headers have not content-type application/json', () ->
          describe 'expected body is a parseable JSON', () ->
            before () ->
              instance = new HttpResponse {
                expected:
                  body: "{}"
              }
              instance.validation = {}
              instance.validation.body = {}
              instance.setBodyExpectedType()

            it 'should set expected type to application/json', () ->
              assert.equal instance.validation.body.expectedType,
                'application/json'

          describe 'expected body is not a parseable JSON', () ->
            before () ->
              instance = new HttpResponse {
                expected:
                  body: "{Boo{Boo"
              }
              instance.validation = {}
              instance.validation.body = {}
              instance.setBodyExpectedType()

            it 'should set expected body to text/plain', () ->
              assert.equal instance.validation.body.expectedType,
                'text/plain'

    describe "#setBodyValidator()", () ->
      describe 'when there is an error prior its execution', () ->
        before () ->
          instance = new HttpResponse {
            expected:
              body: "{}"
          }
          instance.validation = {}
          instance.validation.body  =
            realType: null
            expectedType: null
          instance.validation.body.results = [
            {
              message: "I can't even"
              severity: "error"
            }
          ]
          instance.setBodyValidator()

        it 'should not set any validator', () ->
          assert.equal instance.validation.body.validator, null

        it 'it should not add any error to results', () ->
          results = instance.validation.body.results
          console.log results
          assert.equal results.length, 1


      describe 'real or expected type is null', () ->
        before () ->
          instance = new HttpResponse {
            expected:
              body: "{}"
          }
          instance.validation = {}
          instance.validation.body  =
            realType: null
            expectedType: null
          instance.setBodyValidator()

        it 'should not set any validator', () ->
          assert.equal instance.validation.body.validator,
            null

        it 'should set unknown validator error message to results', () ->
          results = instance.validation.body.results
          results.forEach (result) ->
            results.push result.severity

          assert.include results, 'error'

      jsonContentTypes = [
        'application/json'
        'application/json; charset=utf-8'
        'application/hal+json'
      ]
      for realType in jsonContentTypes then do (realType) ->
        describe 'real is ' + realType, () ->
          for expectedType in jsonContentTypes
            describe 'expected is ' + expectedType, () ->
              before () ->
                instance = new HttpResponse {
                  expected:
                    body: "{}"
                }
                instance.validation = {}
                instance.validation.body =
                  realType: realType
                  expectedType: expectedType
                instance.setBodyValidator()

              it 'should set JsonExample validator', () ->
                assert.equal instance.validation.body.validator,
                  'JsonExample'

              it 'should set no error message', () ->
                assert.equal instance.validation.body.results.length, 0

          describe 'expected is application/schema+json', () ->
            before () ->
              instance = new HttpResponse {
                expected:
                  body: "{}"
              }
              instance.validation = {}
              instance.validation.body =
                realType: realType
                expectedType: 'application/schema+json'
              instance.setBodyValidator()

            it 'should set JsonSchema', () ->
              assert.equal instance.validation.body.validator,
                'JsonSchema'

            it 'should set no error message', () ->
              assert.equal instance.validation.body.results.length, 0

        describe 'expected is text/plain', () ->
          before () ->
            instance = new HttpResponse {
              expected:
                body: "{}"
            }
            instance.validation = {}
            instance.validation.body =
              realType: 'application/json'
              expectedType: 'text/plain'
            instance.setBodyValidator()

          it 'should set no validator for combination error message', () ->
            results = instance.validation.body.results
            results.forEach (result) ->
              results.push result.severity

            assert.include results, 'error'

          it 'should not set any validator', () ->
            assert.equal instance.validation.body.validator,
              null

      describe 'real is text/plain', () ->
        describe 'expected is text/plain', () ->
          before () ->
            instance = new HttpResponse {
              expected:
                body: "{}"
            }
            instance.validation = {}
            instance.validation.body =
              realType: 'text/plain'
              expectedType: 'text/plain'
            instance.setBodyValidator()

          it 'should set TextDiff validator', () ->
            assert.equal instance.validation.body.validator,
              'TextDiff'

          it 'should set no error message', () ->
            assert.equal instance.validation.body.results.length, 0

        describe 'expected is not text/plain', () ->
          before () ->
            instance = new HttpResponse {
              expected:
                body: "{}"
            }
            instance.validation = {}
            instance.validation.body =
              realType: 'text/plain'
              expectedType: 'application/json'
            instance.setBodyValidator()

          it 'should not set any validator', () ->
            assert.equal instance.validation.body.validator,
              null

          it 'should set no validator for combination errror message', () ->
            results = instance.validation.body.results
            results.forEach (result) ->
              results.push result.severity

            assert.include results, 'error'

    describe '#runBodyValidator', () ->
      describe "if JsonExample validator" , () ->
        before () ->
          instance = new HttpResponse response
          instance.body = fixtures.sampleJsonSimpleKeyMissing
          instance.expected =
            body: fixtures.sampleJson

          instance.validation = {}
          instance.validation.body =
            validator: 'JsonExample'
          instance.runBodyValidator()

        it 'should set rawData property', () ->
          assert.isDefined instance.validation.body.rawData

        it 'rawData should not be null', () ->
          assert.isNotNull instance.validation.body.rawData

      describe "when JsonSchema validator" , () ->
        before () ->
          instance = new HttpResponse response
          instance.body = fixtures.sampleJsonSimpleKeyMissing
          instance.expected =
            bodySchema: fixtures.sampleJsonSchema

          instance.validation = {}
          instance.validation.body =
            validator: 'JsonSchema'
          instance.runBodyValidator()

        it 'should set rawData property', () ->
          assert.isDefined instance.validation.body.rawData

        it 'rawData should not be null', () ->
          assert.isNotNull instance.validation.body.rawData

      describe "when TextDiff validator" , () ->
        before () ->
          instance = new HttpResponse response
          instance.body = fixtures.sampleTextLineDiffers
          instance.expected =
            body: fixtures.sampleText

          instance.validation = {}
          instance.validation.body =
            validator: 'TextDiff'
          instance.runBodyValidator()

        it 'should set rawData property', () ->
          assert.isDefined instance.validation.body.rawData

        it 'rawData should not be null', () ->
          assert.isNotNull instance.validation.body.rawData



      describe "when no validator available", () ->
        before () ->
          instance = new HttpResponse response
          instance.body = fixtures.sampleJsonSimpleKeyMissing
          instance.expected =
            body: fixtures.sampleJson

          instance.validation = {}
          instance.validation.body =
            validator: null
          instance.runBodyValidator()

        it 'should let rawData null',() ->
          assert.isNull instance.validation.body.rawData

      describe 'when a validator throws an error', () ->
        before () ->
          invalidSchema = require '../../fixtures/invalid-schema-v4'
          instance = new HttpResponse response
          instance.body = '{}'
          instance.expected =
            bodySchema: invalidSchema
          instance.validation = {}
          instance.validation.body =
            validator: 'JsonSchema'

        it 'should not throw an error', () ->
          fn = () ->
            instance.runBodyValidator()
          assert.doesNotThrow fn

        it 'should add thrown error to results as error', () ->
          instance.runBodyValidator()
          messages = []
          for result in instance.validation.body.results
            messages.push result.message
          assert.include messages, 'JSON schema is not valid draft v4! Data does not match any schemas from "anyOf" at path "/properties/foo/type"'

    describe "#runBodyValidator()", () ->
      before () ->
        instance = new HttpResponse response
        instance.body = fixtures.sampleTextLineDiffers
        instance.expected =
          body: fixtures.sampleText

        instance.validation = {}
        instance.validation.body = {}

        instance.validation.body.rawData = '@@ -1,5 +1,5 @@\n text\n-1\n+2\n'
        instance.validation.body.validator = 'TextDiff'

      describe 'any previously set results', () ->
        before () ->
          instance.validation.body.results = ['booboo']
          instance.runBodyValidator()

        it 'should not overwrite existing results', () ->
          assert.include instance.validation.body.results, 'booboo'

        it 'should set results to an array', () ->
          assert.isArray instance.validation.body.results

      describe 'no previous results', () ->
        before () ->
          instance.validation.body.results = []
          instance.runBodyValidator()

        it 'should set results to an array', () ->
          assert.isArray instance.validation.body.results

        it 'should have 1 result', () ->
          assert.equal instance.validation.body.results.length, 1

      describe 'no validator given', () ->
        before () ->
          instance.validation.body.validator = null

        it 'should not throw', () ->
          fn = () ->
            instance.runBodyValidator()
          assert.doesNotThrow fn

    # Status code validation
    describe '#validateStatusCode',  () ->
      #instance = {}

      before () ->
        response =
          statusCode: 200
          expected:
            statusCode: 200

        instance = new HttpResponse response
        instance.validation = {}

        instance.validateStatusCode()

      fields = [
        'realType'
        'expectedType'
        'validator'
        'rawData'
        'results'
      ]

      fields.forEach (field) ->
        it "should set '" + field + "' property for the component", () ->
          assert.isDefined instance.validation.statusCode[field]

      describe "expceted matches real", () ->
        it 'should set no errors to results', () ->
          assert.equal instance.validation.statusCode.results.length, 0

      describe "expected does not match real", () ->
        before () ->
          response =
            statusCode: 200
            expected:
              statusCode: 201

          instance = new HttpResponse response
          instance.validation = {}

          instance.validate()

        it 'should set error message to results', () ->
          assert.equal instance.validation.statusCode.results.length, 1

        it 'should return false boolean result', () ->
          assert.isFalse instance.isValid()

        it 'should set beutiful error message', () ->
          assert.equal instance.validation.statusCode.results[0].message, "Status code is not '201'"

    describe '#isJsonContentType',  () ->

      jsonContentTypes = [
        'application/json'
        'application/json; charset=utf-8'
        'application/hal+json'
        'application/vnd.something.internal.v1+json; charset=utf-8'
      ]

      nonJsonContentTypes = [
        'application/xml'
        'text/plain'
        'text/html'
        'application/xhtml+xml'
        'application/xml;q=0.9'
        null
        undefined
      ]

      before () ->
        instance = new HttpResponse response


      for contentType in jsonContentTypes then do (contentType) ->
        describe 'when content type is \'' + contentType + '\'', () ->
          it 'should return true', () ->
            assert.isTrue instance.isJsonContentType(contentType)

      for contentType in nonJsonContentTypes then do (contentType) ->
        describe 'when content type is \'' + contentType + '\'', () ->
          it 'should return false', () ->
            assert.isFalse instance.isJsonContentType(contentType)
