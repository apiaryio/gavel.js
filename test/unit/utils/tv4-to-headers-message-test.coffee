{assert} = require 'chai'
tv4ToHeadersMessage = require '../../../src/utils/tv4-to-headers-message'

describe 'tv4ToHeadersMessages()', ->

  describe 'when message for missing header', ->
    it 'should return message with right text', ->
      tv4Message = 'At \'/header2\' Missing required property: header2'
      message = tv4ToHeadersMessage(tv4Message)
      assert.equal message, "Header 'header2' is missing"

  describe 'when message for different value', ->
    it 'should return message with right text', ->
      tv4Message = 'At \'/content-type\' No enum match for: "application/fancy-madiatype"'
      message = tv4ToHeadersMessage(tv4Message)
      assert.equal message, "Header 'content-type' doesn't have value 'application/fancy-madiatype'"

  describe 'when unknonw message', ->
    it 'should throw an error', ->
      fn = () ->
        tv4ToHeadersMessage("String does not match pattern: {pattern}")
      assert.throws fn

