{assert}       = require('chai')
{validate}     = require('../src/')
fixtures       = require '../test/fixtures'


describe 'Validation Interface', ->
  describe 'When I have valid example in JSON form with body in form data', ->
    hitDefinitionByExample = undefined

    before ->
      hitDefinitionByExample =
        request:
          headers:
            'x-custom-header': 'AnyValue'
          body: 'a=b&c=d'

        response:
          headers:
            'x-custom-response-header': 'AnotherValue'
          body: 'formanswer=yes&additionaldata=doublespeak'


    describe 'and send in a real hit with same structure, but different values', ->
      validationErrors = undefined

      before ->
        realHit =
          request:
            headers:
              'x-custom-header': 'Another-AnyValue'
            body: 'different=true'

          response:
            headers:
              'x-custom-response-header': 'Another-AnotherValue'
            body: 'somethingdifferent=yes&formanswer=yes'

        validationErrors = validate definition: hitDefinitionByExample, real: realHit

      it 'I have error on request header', ->
        # WTF
        # assert.equal validationErrors.request.headers['x-custom-header'].propertyValue 'AnyValue'
        assert.equal validationErrors.request.headers['["x-custom-header"]'].propertyValue, 'Another-AnyValue'

      it 'I have error on first request body line', ->
        assert.equal validationErrors.request.body['["0_869bc90a958424fd95dcc0d57d14be6f"]'].propertyValue, 'different=true'


      it 'I have error on responseheader', ->
        # WTF
        # assert.equal validationErrors.request.headers['x-custom-response-header'].propertyValue 'AnotherValue'
        assert.equal validationErrors.response.headers['["x-custom-response-header"]'].propertyValue, 'Another-AnotherValue'

      it 'I have error on first response body line', ->
        assert.equal validationErrors.response.body['["0_6e48ce3721f33663731b541112285603"]'].propertyValue, 'somethingdifferent=yes&formanswer=yes'


  describe 'When I have valid example in JSON form with JSON bodies', ->
    hitDefinitionByExample = undefined

    before ->
      hitDefinitionByExample =
        request:
          headers:
            'Content-Type': 'application/json'
          body:
            s: 'value'
            i: 123

        response:
          headers:
            'Content-Type': 'application/json'
          body:
            s: 'value'
            i: 123

    describe 'and send in same it', ->
      validationErrors = undefined

      before ->
        validationErrors = validate definition: hitDefinitionByExample, real: hitDefinitionByExample

      it 'I have no validation errors', -> assert.equal null, validationErrors

