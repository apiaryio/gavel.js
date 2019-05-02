const { assert } = require('chai');

const tv4ToHeadersMessage = require('../../../lib/utils/tv4-to-headers-message');
const fixtures = require('../../fixtures');

describe('tv4ToHeadersMessages()', () => {
  expectedHeaders = fixtures.sampleHeaders;
  describe('when message for missing header', () => {
    it('should return message with right text', () => {
      tv4Message = "At '/header2' Missing required property: header2";
      message = tv4ToHeadersMessage(tv4Message, expectedHeaders);
      assert.equal(message, "Header 'header2' is missing");
    });
  });

  describe('when message for different value', () => {
    it('should return message with right text', () => {
      tv4Message =
        'At \'/content-type\' No enum match for: "application/fancy-madiatype"';
      message = tv4ToHeadersMessage(tv4Message, expectedHeaders);
      assert.equal(
        message,
        "Header 'content-type' has value 'application/fancy-madiatype' instead of 'application/json'"
      );
    });
  });

  describe('when unknonw message', () => {
    it('should throw an error', () => {
      const fn = () => {
        tv4ToHeadersMessage('String does not match pattern: {pattern}');
      };
      assert.throws(fn);
    });
  });
});
