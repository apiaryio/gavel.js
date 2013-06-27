{assert}       = require('chai')

fixtures       = require '../fixtures'
{Errors}       = require '../../src/errors'

describe 'Errors', ->
  errors = {}
  amandaError = JSON.parse fixtures.sampleAmandaError

  describe 'when I create Errors object from amanda error', ->
    before ->
      errors = new Errors amandaError

    it 'should has same int. keys and its values as original amanda error', ->
      for i in [0..amandaError.length-1]
        assert.deepEqual amandaError[i], errors[i]

    it 'should get correct error by getByPath', ->
      for i in [0..amandaError.length-1]
        assert.deepEqual amandaError[i], errors.getByPath(amandaError[i]['property'])[0]

