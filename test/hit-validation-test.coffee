{assert} = require('chai')
{HitValidation} = require('../src/hit-validation')
fixtures = require '../test/fixtures'

getHit = ({reqBodyDefined, reqHeadersDefined, reqBodySchema, req_headers_schema, reqBodyReal, reqHeadersReal, resBodyDefined, resHeadersDefined, resBodyReal, resHeadersReal, resBodySchema, res_headers_schema }) ->

  hit = new fixtures.hitStructure

  hit.request.defined.body            = reqBodyDefined
  hit.request.defined.headers         = reqHeadersDefined
  hit.request.defined.schema.body     = reqBodySchema || ''
  hit.request.defined.schema.headers  = req_headers_schema || ''
  hit.request.realPayload.body        = reqBodyReal
  hit.request.realPayload.headers     = reqHeadersReal

  hit.response.defined.body           = resBodyDefined
  hit.response.defined.headers        = resHeadersDefined
  hit.response.defined.schema.body    = resBodySchema || ''
  hit.response.defined.schema.headers = res_headers_schema || ''
  hit.response.realPayload.body       = resBodyReal
  hit.response.realPayload.headers    = resHeadersReal

  return hit

describe 'HitValidation', ->
  hit = undefined
  hitValidation = undefined
  describe 'when body is json parsable', ->
    describe 'when custom schema is provided', ->
      describe 'and there are aditional keys in real payload', ->
        before ->
          params =  {
            reqBodyDefined:     fixtures.sampleText,
            reqBodySchema:      fixtures.sampleJsonSchemaNonStrict
            reqHeadersDefined:  fixtures.sampleHeaders,
            reqBodyReal:        fixtures.sampleJsonComplexKeyAdded,
            reqHeadersReal:     fixtures.sampleHeaders,

            resBodyDefined:     fixtures.sampleText,
            resBodySchema:      fixtures.sampleJsonSchemaNonStrict
            resHeadersDefined:  fixtures.sampleHeaders,
            resBodyReal:        fixtures.sampleJsonComplexKeyAdded,
            resHeadersReal:     fixtures.sampleHeaders
          }
          hit = getHit params
          hitValidation = new HitValidation hit

        it "shouldn't set errors for body in request and response", () ->
          hitValidation.validate()

          assert.isNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

      describe 'and there are missing keys in real payloads', ->
        before ->
          params =  {
            reqBodyDefined:     fixtures.sampleText,
            reqBodySchema:      fixtures.sampleJsonSchemaNonStrict
            reqHeadersDefined:  fixtures.sampleHeaders,
            reqBodyReal:        fixtures.sampleJsonComplexKeyMissing,
            reqHeadersReal:     fixtures.sampleHeaders,

            resBodyDefined:     fixtures.sampleText,
            resBodySchema:      fixtures.sampleJsonSchemaNonStrict
            resHeadersDefined:  fixtures.sampleHeaders,
            resBodyReal:        fixtures.sampleJsonComplexKeyMissing,
            resHeadersReal:     fixtures.sampleHeaders
          }
          hit = getHit params
          hitValidation = new HitValidation hit

        it "should set errors for body in request and response", () ->
          hitValidation.validate()

          assert.isNotNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
          assert.isDefined hitValidation.hit.request.validationResults.body['complex_key_value_pair.complex_key_value_pair_key3.complex_key_value_pair_key1_in_nested_hash'], 'complex_key_value_pair.complex_key_value_pair_key3.complex_key_value_pair_key1_in_nested_hash is defined'
          assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isNotNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
          assert.isDefined hitValidation.hit.response.validationResults.body['complex_key_value_pair.complex_key_value_pair_key3.complex_key_value_pair_key1_in_nested_hash'], 'complex_key_value_pair.complex_key_value_pair_key3.complex_key_value_pair_key1_in_nested_hash is defined'
          assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

      describe 'and there are different values in real payloads', ->
        before ->
          params =  {
            reqBodyDefined:     fixtures.sampleText,
            reqBodySchema:      fixtures.sampleJsonSchemaNonStrict
            reqHeadersDefined:  fixtures.sampleHeaders,
            reqBodyReal:        fixtures.sampleJsonComplexKeyValueDiffers,
            reqHeadersReal:     fixtures.sampleHeaders,

            resBodyDefined:     fixtures.sampleText,
            resBodySchema:      fixtures.sampleJsonSchemaNonStrict
            resHeadersDefined:  fixtures.sampleHeaders,
            resBodyReal:        fixtures.sampleJsonComplexKeyValueDiffers,
            resHeadersReal:     fixtures.sampleHeaders
          }
          hit = getHit params
          hitValidation = new HitValidation hit

        it "shouldn't set errors for body in request and response", () ->
          hitValidation.validate()

          assert.isNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

    describe 'when body and headers are same in request and response', ->
      before ->
        params =  {
          reqBodyDefined:     fixtures.sampleJson,
          reqHeadersDefined:  fixtures.sampleHeaders,
          reqBodyReal:        fixtures.sampleJson,
          reqHeadersReal:     fixtures.sampleHeaders,
          resBodyDefined:     fixtures.sampleJson,
          resHeadersDefined:  fixtures.sampleHeaders,
          resBodyReal:        fixtures.sampleJson,
          resHeadersReal:     fixtures.sampleHeaders
        }
        hit = getHit params
        hitValidation = new HitValidation hit

      it "shouldn't set any errors", () ->
        hitValidation.validate()
        assert.isNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
        assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
        assert.isNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
        assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

    describe 'when no schema is provided', ->
      describe 'when keys are added to body and headers', ->
        before ->
          params =  {
            reqBodyDefined:     fixtures.sampleJson,
            reqHeadersDefined:  fixtures.sampleHeaders,
            reqBodyReal:        fixtures.sampleJsonSimpleKeyAdded,
            reqHeadersReal:     fixtures.sampleHeadersAdded,
            resBodyDefined:     fixtures.sampleJson,
            resHeadersDefined:  fixtures.sampleHeaders,
            resBodyReal:        fixtures.sampleJsonSimpleKeyAdded,
            resHeadersReal:     fixtures.sampleHeadersAdded
          }
          hit = getHit params
          hitValidation = new HitValidation hit

        it "shouldn't set any errors", () ->
          hitValidation.validate()
          assert.isNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

      describe 'when keys are missing from body and headers', ->
        before ->
          params =  {
            reqBodyDefined:     fixtures.sampleJson,
            reqHeadersDefined:  fixtures.sampleHeaders,
            reqBodyReal:        fixtures.sampleJsonSimpleKeyMissing,
            reqHeadersReal:     fixtures.sampleHeadersMissing,
            resBodyDefined:     fixtures.sampleJson,
            resHeadersDefined:  fixtures.sampleHeaders,
            resBodyReal:        fixtures.sampleJsonSimpleKeyMissing,
            resHeadersReal:     fixtures.sampleHeadersMissing
          }
          hit = getHit params
          hitValidation = new HitValidation hit

        it "should set errors for body and headers in request and response", () ->
          hitValidation.validate()

          assert.isNotNull hitValidation.hit.request.validationResults.body , 'request.validationResults.body is defined'
          assert.isDefined hitValidation.hit.request.validationResults.body['simple_key_value_pair'], 'simple_key_value_pair is defined'
          assert.isNotNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is defined'
          assert.isDefined hitValidation.hit.request.validationResults.headers['header2'], 'header2 is defined'
          assert.isNotNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
          assert.isDefined hitValidation.hit.response.validationResults.body['simple_key_value_pair'], 'simple_key_value_pair is defined'
          assert.isNotNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is defined'
          assert.isDefined hitValidation.hit.response.validationResults.headers['header2'], 'header2 is defined'

      describe 'when values are different in body and headers', ->
        before ->
          params =  {
            reqBodyDefined:     fixtures.sampleJson,
            reqHeadersDefined:  fixtures.sampleHeaders,
            reqBodyReal:        fixtures.sampleJsonSimpleKeyValueDiffers,
            reqHeadersReal:     fixtures.sampleHeadersDiffers,
            resBodyDefined:     fixtures.sampleJson,
            resHeadersDefined:  fixtures.sampleHeaders,
            resBodyReal:        fixtures.sampleJsonSimpleKeyValueDiffers,
            resHeadersReal:     fixtures.sampleHeadersDiffers
          }
          hit = getHit params
          hitValidation = new HitValidation hit

        it "should set errors for headers and no errors for body in request and response", () ->
          hitValidation.validate()

          assert.isNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isNotNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is defined'
          assert.isDefined hitValidation.hit.request.validationResults.headers['header2'], 'header2 is defined'
          assert.isNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isNotNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is defined'
          assert.isDefined hitValidation.hit.response.validationResults.headers['header2'], 'header2 is defined'

      describe 'when value is missing in array in body', ->
        before ->
          params =  {
          reqBodyDefined:     fixtures.sampleJson,
          reqHeadersDefined:  fixtures.sampleHeaders,
          reqBodyReal:        fixtures.sampleJsonArrayItemMissing,
          reqHeadersReal:     fixtures.sampleHeaders,
          resBodyDefined:     fixtures.sampleJson,
          resHeadersDefined:  fixtures.sampleHeaders,
          resBodyReal:        fixtures.sampleJsonArrayItemMissing,
          resHeadersReal:     fixtures.sampleHeaders
          }
          hit = getHit params
          hitValidation = new HitValidation hit

        it "should set errors for body in request and response", () ->
          hitValidation.validate()

          assert.isNotNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
          assert.isDefined hitValidation.hit.request.validationResults.body['array_of_mixed_simple_types[3]'], 'array_of_mixed_simple_types[3] is defined'
          assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isNotNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
          assert.isDefined hitValidation.hit.response.validationResults.body['array_of_mixed_simple_types[3]'], 'array_of_mixed_simple_types[3] is defined'
          assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

      describe 'when value is added to array in body', ->
        before ->
          params =  {
          reqBodyDefined:     fixtures.sampleJson,
          reqHeadersDefined:  fixtures.sampleHeaders,
          reqBodyReal:        fixtures.sampleJsonArrayItemAdded,
          reqHeadersReal:     fixtures.sampleHeaders,
          resBodyDefined:     fixtures.sampleJson,
          resHeadersDefined:  fixtures.sampleHeaders,
          resBodyReal:        fixtures.sampleJsonArrayItemAdded,
          resHeadersReal:     fixtures.sampleHeaders
          }
          hit = getHit params
          hitValidation = new HitValidation hit

        it "should set errors for body in request and response", () ->
          hitValidation.validate()
          assert.isNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

  describe "when body isn't json parsable (handled as text)", ->
    describe 'and lines are added', ->
      before ->
        params =  {
        reqBodyDefined:     fixtures.sampleText,
        reqHeadersDefined:  fixtures.sampleHeaders,
        reqBodyReal:        fixtures.sampleTextLineAdded,
        reqHeadersReal:     fixtures.sampleHeaders,

        resBodyDefined:     fixtures.sampleText,
        resHeadersDefined:  fixtures.sampleHeaders,
        resBodyReal:        fixtures.sampleTextLineAdded,
        resHeadersReal:     fixtures.sampleHeaders
        }
        hit = getHit params
        hitValidation = new HitValidation hit

      it "should set errors for body in request and response", () ->
        hitValidation.validate()

        assert.isNotNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
        assert.isDefined hitValidation.hit.request.validationResults.body['["3_4ecfd8ea4b5004e149dff2a66c367c60"]'], '["3_4ecfd8ea4b5004e149dff2a66c367c60"] is defined'
        assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
        assert.isNotNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
        assert.isDefined hitValidation.hit.response.validationResults.body['["3_4ecfd8ea4b5004e149dff2a66c367c60"]'], '["3_4ecfd8ea4b5004e149dff2a66c367c60"] is defined'
        assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

    describe 'and lines are missing', ->
      before ->
        params =  {
        reqBodyDefined:     fixtures.sampleText,
        reqHeadersDefined:  fixtures.sampleHeaders,
        reqBodyReal:        fixtures.sampleTextLineMissing,
        reqHeadersReal:     fixtures.sampleHeaders,

        resBodyDefined:     fixtures.sampleText,
        resHeadersDefined:  fixtures.sampleHeaders,
        resBodyReal:        fixtures.sampleTextLineMissing,
        resHeadersReal:     fixtures.sampleHeaders
        }
        hit = getHit params
        hitValidation = new HitValidation hit

      it "should set errors for body in request and response", () ->
        hitValidation.validate()

        assert.isNotNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
        assert.isDefined hitValidation.hit.request.validationResults.body['["1_4ecfd8ea4b5004e149dff2a66c367c60"]'], '["1_4ecfd8ea4b5004e149dff2a66c367c60"] is defined'
        assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
        assert.isNotNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
        assert.isDefined hitValidation.hit.response.validationResults.body['["1_4ecfd8ea4b5004e149dff2a66c367c60"]'], '["1_4ecfd8ea4b5004e149dff2a66c367c60"] is defined'
        assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

    describe 'and lines are changed', ->
      before ->
        params =  {
        reqBodyDefined:     fixtures.sampleText,
        reqHeadersDefined:  fixtures.sampleHeaders,
        reqBodyReal:        fixtures.sampleTextLineDiffers,
        reqHeadersReal:     fixtures.sampleHeaders,

        resBodyDefined:     fixtures.sampleText,
        resHeadersDefined:  fixtures.sampleHeaders,
        resBodyReal:        fixtures.sampleTextLineDiffers,
        resHeadersReal:     fixtures.sampleHeaders
        }
        hit = getHit params
        hitValidation = new HitValidation hit

      it "should set errors for body in request and response", () ->
        hitValidation.validate()

        assert.isNotNull hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
        assert.isDefined hitValidation.hit.request.validationResults.body['["2_68d47ae10cf158f7bf664a8980834673"]'], '["2_68d47ae10cf158f7bf664a8980834673"] is defined'
        assert.isNull hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
        assert.isNotNull hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
        assert.isDefined hitValidation.hit.response.validationResults.body['["2_68d47ae10cf158f7bf664a8980834673"]'], '["2_68d47ae10cf158f7bf664a8980834673"] is defined'
        assert.isNull hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'


  