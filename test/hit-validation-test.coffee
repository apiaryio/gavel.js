{assert} = require('chai')
{HitValidation} = require('../src/hit-validation')
fixtures = require '../test/fixtures'



get_hit = ({req_body_defined, req_headers_defined, req_body_schema, req_headers_schema, req_body_real, req_headers_real, res_body_defined, res_headers_defined, res_body_real, res_headers_real, res_body_schema, res_headers_schema }) ->

  hit = new fixtures.hitStructure

  hit.request.defined.body            = req_body_defined
  hit.request.defined.headers         = req_headers_defined
  hit.request.defined.schema.body     = req_body_schema || {}
  hit.request.defined.schema.headers  = req_headers_schema || {}
  hit.request.realPayload.body        = req_body_real
  hit.request.realPayload.headers     = req_headers_real

  hit.response.defined.body           = res_body_defined
  hit.response.defined.headers        = res_headers_defined
  hit.response.defined.schema.body    = res_body_schema || {}
  hit.response.defined.schema.headers = res_headers_schema || {}
  hit.response.realPayload.body       = res_body_real
  hit.response.realPayload.headers    = res_headers_real

  return hit

describe 'HitValidation', ->
  hit = undefined
  hitValidation = undefined
  describe 'when body is json parsable', ->
    describe 'when custom schema is provided', ->
      describe 'and there are aditional keys in real payload', ->
        before ->
          params =  {
            req_body_defined:     fixtures.sampleText,
            req_body_schema:      JSON.parse fixtures.sampleJsonSchemaNonStrict
            req_headers_defined:  fixtures.sampleHeaders,
            req_body_real:        fixtures.sampleJsonComplexKeyAdded,
            req_headers_real:     fixtures.sampleHeaders,

            res_body_defined:     fixtures.sampleText,
            res_body_schema:      JSON.parse fixtures.sampleJsonSchemaNonStrict
            res_headers_defined:  fixtures.sampleHeaders,
            res_body_real:        fixtures.sampleJsonComplexKeyAdded,
            res_headers_real:     fixtures.sampleHeaders
          }
          hit = get_hit params
          hitValidation = new HitValidation hit

        it "shouldn't set errors for body in request and response", () ->
          hitValidation.validate()

          assert.isUndefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isUndefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

      describe 'and there are missing keys in real payloads', ->
        before ->
          params =  {
            req_body_defined:     fixtures.sampleText,
            req_body_schema:      JSON.parse fixtures.sampleJsonSchemaNonStrict
            req_headers_defined:  fixtures.sampleHeaders,
            req_body_real:        fixtures.sampleJsonComplexKeyMissing,
            req_headers_real:     fixtures.sampleHeaders,

            res_body_defined:     fixtures.sampleText,
            res_body_schema:      JSON.parse fixtures.sampleJsonSchemaNonStrict
            res_headers_defined:  fixtures.sampleHeaders,
            res_body_real:        fixtures.sampleJsonComplexKeyMissing,
            res_headers_real:     fixtures.sampleHeaders
          }
          hit = get_hit params
          hitValidation = new HitValidation hit

        it "should set errors for body in request and response", () ->
          hitValidation.validate()

          assert.isDefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
          assert.isDefined hitValidation.hit.request.validationResults.body['complex_key_value_pair.complex_key_value_pair_key3.complex_key_value_pair_key1_in_nested_hash'], 'complex_key_value_pair.complex_key_value_pair_key3.complex_key_value_pair_key1_in_nested_hash is defined'
          assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isDefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
          assert.isDefined hitValidation.hit.response.validationResults.body['complex_key_value_pair.complex_key_value_pair_key3.complex_key_value_pair_key1_in_nested_hash'], 'complex_key_value_pair.complex_key_value_pair_key3.complex_key_value_pair_key1_in_nested_hash is defined'
          assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

      describe 'and there are different values in real payloads', ->
        before ->
          params =  {
            req_body_defined:     fixtures.sampleText,
            req_body_schema:      JSON.parse fixtures.sampleJsonSchemaNonStrict
            req_headers_defined:  fixtures.sampleHeaders,
            req_body_real:        fixtures.sampleJsonComplexKeyValueDiffers,
            req_headers_real:     fixtures.sampleHeaders,

            res_body_defined:     fixtures.sampleText,
            res_body_schema:      JSON.parse fixtures.sampleJsonSchemaNonStrict
            res_headers_defined:  fixtures.sampleHeaders,
            res_body_real:        fixtures.sampleJsonComplexKeyValueDiffers,
            res_headers_real:     fixtures.sampleHeaders
          }
          hit = get_hit params
          hitValidation = new HitValidation hit

        it "shouldn't set errors for body in request and response", () ->
          hitValidation.validate()

          assert.isUndefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isUndefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

    describe 'when body and headers are same in request and response', ->
      before ->
        params =  {
          req_body_defined:     fixtures.sampleJson,
          req_headers_defined:  fixtures.sampleHeaders,
          req_body_real:        fixtures.sampleJson,
          req_headers_real:     fixtures.sampleHeaders,
          res_body_defined:     fixtures.sampleJson,
          res_headers_defined:  fixtures.sampleHeaders,
          res_body_real:        fixtures.sampleJson,
          res_headers_real:     fixtures.sampleHeaders
        }
        hit = get_hit params
        hitValidation = new HitValidation hit

      it "shouldn't set any errors", () ->
        hitValidation.validate()
        assert.isUndefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
        assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
        assert.isUndefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
        assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

    describe 'when no schema is provided', ->
      describe 'when keys are added to body and headers', ->
        before ->
          params =  {
            req_body_defined:     fixtures.sampleJson,
            req_headers_defined:  fixtures.sampleHeaders,
            req_body_real:        fixtures.sampleJsonSimpleKeyAdded,
            req_headers_real:     fixtures.sampleHeadersAdded,
            res_body_defined:     fixtures.sampleJson,
            res_headers_defined:  fixtures.sampleHeaders,
            res_body_real:        fixtures.sampleJsonSimpleKeyAdded,
            res_headers_real:     fixtures.sampleHeadersAdded
          }
          hit = get_hit params
          hitValidation = new HitValidation hit

        it "shouldn't set any errors", () ->
          hitValidation.validate()
          assert.isUndefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isUndefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

      describe 'when keys are missing from body and headers', ->
        before ->
          params =  {
            req_body_defined:     fixtures.sampleJson,
            req_headers_defined:  fixtures.sampleHeaders,
            req_body_real:        fixtures.sampleJsonSimpleKeyMissing,
            req_headers_real:     fixtures.sampleHeadersMissing,
            res_body_defined:     fixtures.sampleJson,
            res_headers_defined:  fixtures.sampleHeaders,
            res_body_real:        fixtures.sampleJsonSimpleKeyMissing,
            res_headers_real:     fixtures.sampleHeadersMissing
          }
          hit = get_hit params
          hitValidation = new HitValidation hit

        it "should set errors for body and headers in request and response", () ->
          hitValidation.validate()

          assert.isDefined hitValidation.hit.request.validationResults.body , 'request.validationResults.body is defined'
          assert.isDefined hitValidation.hit.request.validationResults.body['simple_key_value_pair'], 'simple_key_value_pair is defined'
          assert.isDefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is defined'
          assert.isDefined hitValidation.hit.request.validationResults.headers['header2'], 'header2 is defined'
          assert.isDefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
          assert.isDefined hitValidation.hit.response.validationResults.body['simple_key_value_pair'], 'simple_key_value_pair is defined'
          assert.isDefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is defined'
          assert.isDefined hitValidation.hit.response.validationResults.headers['header2'], 'header2 is defined'

      describe 'when values are different in body and headers', ->
        before ->
          params =  {
            req_body_defined:     fixtures.sampleJson,
            req_headers_defined:  fixtures.sampleHeaders,
            req_body_real:        fixtures.sampleJsonSimpleKeyValueDiffers,
            req_headers_real:     fixtures.sampleHeadersDiffers,
            res_body_defined:     fixtures.sampleJson,
            res_headers_defined:  fixtures.sampleHeaders,
            res_body_real:        fixtures.sampleJsonSimpleKeyValueDiffers,
            res_headers_real:     fixtures.sampleHeadersDiffers
          }
          hit = get_hit params
          hitValidation = new HitValidation hit

        it "should set errors for headers and no errors for body in request and response", () ->
          hitValidation.validate()

          assert.isUndefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isDefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is defined'
          assert.isDefined hitValidation.hit.request.validationResults.headers['header2'], 'header2 is defined'
          assert.isUndefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isDefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is defined'
          assert.isDefined hitValidation.hit.response.validationResults.headers['header2'], 'header2 is defined'

      describe 'when value is missing in array in body', ->
        before ->
          params =  {
          req_body_defined:     fixtures.sampleJson,
          req_headers_defined:  fixtures.sampleHeaders,
          req_body_real:        fixtures.sampleJsonArrayItemMissing,
          req_headers_real:     fixtures.sampleHeaders,
          res_body_defined:     fixtures.sampleJson,
          res_headers_defined:  fixtures.sampleHeaders,
          res_body_real:        fixtures.sampleJsonArrayItemMissing,
          res_headers_real:     fixtures.sampleHeaders
          }
          hit = get_hit params
          hitValidation = new HitValidation hit

        it "should set errors for body in request and response", () ->
          hitValidation.validate()

          assert.isDefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
          assert.isDefined hitValidation.hit.request.validationResults.body['array_of_mixed_simple_types[3]'], 'array_of_mixed_simple_types[3] is defined'
          assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isDefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
          assert.isDefined hitValidation.hit.response.validationResults.body['array_of_mixed_simple_types[3]'], 'array_of_mixed_simple_types[3] is defined'
          assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

      describe 'when value is added to array in body', ->
        before ->
          params =  {
          req_body_defined:     fixtures.sampleJson,
          req_headers_defined:  fixtures.sampleHeaders,
          req_body_real:        fixtures.sampleJsonArrayItemAdded,
          req_headers_real:     fixtures.sampleHeaders,
          res_body_defined:     fixtures.sampleJson,
          res_headers_defined:  fixtures.sampleHeaders,
          res_body_real:        fixtures.sampleJsonArrayItemAdded,
          res_headers_real:     fixtures.sampleHeaders
          }
          hit = get_hit params
          hitValidation = new HitValidation hit

        it "should set errors for body in request and response", () ->
          hitValidation.validate()
          assert.isUndefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is not defined'
          assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
          assert.isUndefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is not defined'
          assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

  describe "when body isn't json parsable (handled as text)", ->
    describe 'and lines are added', ->
      before ->
        params =  {
        req_body_defined:     fixtures.sampleText,
        req_headers_defined:  fixtures.sampleHeaders,
        req_body_real:        fixtures.sampleTextLineAdded,
        req_headers_real:     fixtures.sampleHeaders,

        res_body_defined:     fixtures.sampleText,
        res_headers_defined:  fixtures.sampleHeaders,
        res_body_real:        fixtures.sampleTextLineAdded,
        res_headers_real:     fixtures.sampleHeaders
        }
        hit = get_hit params
        hitValidation = new HitValidation hit

      it "should set errors for body in request and response", () ->
        hitValidation.validate()

        assert.isDefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
        assert.isDefined hitValidation.hit.request.validationResults.body['["3_4ecfd8ea4b5004e149dff2a66c367c60"]'], '["3_4ecfd8ea4b5004e149dff2a66c367c60"] is defined'
        assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
        assert.isDefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
        assert.isDefined hitValidation.hit.response.validationResults.body['["3_4ecfd8ea4b5004e149dff2a66c367c60"]'], '["3_4ecfd8ea4b5004e149dff2a66c367c60"] is defined'
        assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

    describe 'and lines are missing', ->
      before ->
        params =  {
        req_body_defined:     fixtures.sampleText,
        req_headers_defined:  fixtures.sampleHeaders,
        req_body_real:        fixtures.sampleTextLineMissing,
        req_headers_real:     fixtures.sampleHeaders,

        res_body_defined:     fixtures.sampleText,
        res_headers_defined:  fixtures.sampleHeaders,
        res_body_real:        fixtures.sampleTextLineMissing,
        res_headers_real:     fixtures.sampleHeaders
        }
        hit = get_hit params
        hitValidation = new HitValidation hit

      it "should set errors for body in request and response", () ->
        hitValidation.validate()

        assert.isDefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
        assert.isDefined hitValidation.hit.request.validationResults.body['["1_4ecfd8ea4b5004e149dff2a66c367c60"]'], '["1_4ecfd8ea4b5004e149dff2a66c367c60"] is defined'
        assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
        assert.isDefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
        assert.isDefined hitValidation.hit.response.validationResults.body['["1_4ecfd8ea4b5004e149dff2a66c367c60"]'], '["1_4ecfd8ea4b5004e149dff2a66c367c60"] is defined'
        assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'

    describe 'and lines are changed', ->
      before ->
        params =  {
        req_body_defined:     fixtures.sampleText,
        req_headers_defined:  fixtures.sampleHeaders,
        req_body_real:        fixtures.sampleTextLineDiffers,
        req_headers_real:     fixtures.sampleHeaders,

        res_body_defined:     fixtures.sampleText,
        res_headers_defined:  fixtures.sampleHeaders,
        res_body_real:        fixtures.sampleTextLineDiffers,
        res_headers_real:     fixtures.sampleHeaders
        }
        hit = get_hit params
        hitValidation = new HitValidation hit

      it "should set errors for body in request and response", () ->
        hitValidation.validate()
        console.error hitValidation.hit.request.validationResults.body
        console.error hitValidation.hit.response.validationResults.body
        assert.isDefined hitValidation.hit.request.validationResults.body, 'request.validationResults.body is defined'
        assert.isDefined hitValidation.hit.request.validationResults.body['["2_68d47ae10cf158f7bf664a8980834673"]'], '["2_68d47ae10cf158f7bf664a8980834673"] is defined'
        assert.isUndefined hitValidation.hit.request.validationResults.headers, 'request.validationResults.headers is not defined'
        assert.isDefined hitValidation.hit.response.validationResults.body, 'response.validationResults.body is defined'
        assert.isDefined hitValidation.hit.response.validationResults.body['["2_68d47ae10cf158f7bf664a8980834673"]'], '["2_68d47ae10cf158f7bf664a8980834673"] is defined'
        assert.isUndefined hitValidation.hit.response.validationResults.headers, 'response.validationResults.headers is not defined'


  