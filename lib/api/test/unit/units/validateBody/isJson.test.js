const { assert } = require('chai');
const mediaTyper = require('media-typer');
const { isJson } = require('../../../../units/validateBody');

describe('isJson', () => {
  describe('returns true', () => {
    it('when given valid json media type', () => {
      assert.isTrue(isJson(mediaTyper.parse('application/json')));
    });

    it('when given json-compatible media type', () => {
      assert.isTrue(isJson(mediaTyper.parse('application/schema+json')));
    });
  });

  describe('returns false', () => {
    it('when given non-json media type', () => {
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
