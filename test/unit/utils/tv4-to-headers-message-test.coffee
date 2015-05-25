{assert} = require 'chai'

tv4ToHeadersMessage = require '../../../src/utils/tv4-to-headers-message'
fixtures = require '../../fixtures'

describe 'tv4ToHeadersMessages()', ->
  expectedHeaders = fixtures.sampleHeaders
  describe 'when message for missing header', ->
    it 'should return message with right text', ->
      tv4Message = 'At \'/header2\' Missing required property: header2'
      message = tv4ToHeadersMessage(tv4Message, expectedHeaders)
      assert.equal message, "Header 'header2' is missing"

  describe 'when message for different value', ->
    it 'should return message with right text', ->
      tv4Message = 'At \'/content-type\' No enum match for: "application/fancy-madiatype"'
      message = tv4ToHeadersMessage(tv4Message, expectedHeaders)
      assert.equal message, "Header 'content-type' has value 'application/fancy-madiatype' instead of 'application/json'"

  describe 'when unknonw message', ->
    it 'should throw an error', ->
      fn = () ->
        tv4ToHeadersMessage("String does not match pattern: {pattern}")
      assert.throws fn

