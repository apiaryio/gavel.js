const { assert } = require('chai');
const mediaTyper = require('media-typer');
const { isJsonSchema } = require('../../../../units/validateBody');

describe('isJsonSchema', () => {
  describe('returns true', () => {
    it('when given a JSON schema media type', () => {
      assert.isTrue(isJsonSchema(mediaTyper.parse('application/schema+json')));
    });
  });

  describe('returns false', () => {
    it('when given json media type', () => {
      assert.isFalse(isJsonSchema(mediaTyper.parse('application/json')));
    });

    it('when given rubbish', () => {
      assert.isFalse(isJsonSchema('abc'));
    });

    it('when given null', () => {
      assert.isFalse(isJsonSchema(null));
    });
  });
});
