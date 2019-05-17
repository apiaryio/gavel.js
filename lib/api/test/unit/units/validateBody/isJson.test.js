const { assert } = require('chai');
const mediaTyper = require('media-typer');
const { isJson } = require('../../../../units/validateBody');

describe('isJson', () => {
  describe('returns true', () => {
    it('when given valid JSON media type', () => {
      assert.isTrue(isJson(mediaTyper.parse('application/json')));
    });

    it('when given JSON-compatible media type', () => {
      assert.isTrue(isJson(mediaTyper.parse('application/schema+json')));
    });
  });

  describe('returns false', () => {
    it('when given non-JSON media type', () => {
      assert.isFalse(isJson(mediaTyper.parse('text/plain')));
    });

    it('when given rubbish', () => {
      assert.isFalse(isJson('abc'));
    });

    it('when given null', () => {
      assert.isFalse(isJson(null));
    });
  });
});
