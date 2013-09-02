{assert}       = require('chai')

fixtures       = require '../../fixtures'
{ValidationErrors}       = require '../../../src/validators/validation-errors'

describe 'ValidationErrors', ->
  errors = {}
  amandaError = JSON.parse fixtures.sampleAmandaError

  describe 'when I create ValidationErrors object from amanda error', ->
    before ->
      errors = new ValidationErrors amandaError

    it 'DEPRECATED: should has same int. keys and its values as original amanda error'#, ->
      #for i in [0..amandaError.length-1]
      #  assert.deepEqual amandaError[i], errors[i]

    it 'DEPRECATED: should get correct error by getByPath'#, ->
      #for i in [0..amandaError.length-1]
      #  assert.deepEqual amandaError[i], errors.getByPath(amandaError[i]['property'])[0]

