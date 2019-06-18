const { assert } = require('chai');
const { isJsonContentType } = require('../../../../lib/units/validateBody');

describe('isJsonContentType', () => {
  describe('returns true', () => {
    const jsonTypes = ['application/json', 'application/schema+json'];

    jsonTypes.forEach((contentType) => {
      it(`when given ${contentType}`, () => {
        assert.isTrue(isJsonContentType(contentType));
      });
    });
  });

  describe('returns false', () => {
    const nonJsonTypes = ['application/xml', 'text/plain'];

    nonJsonTypes.forEach((contentType) => {
      it(`when given ${contentType}`, () => {
        assert.isFalse(isJsonContentType(contentType));
      });
    });

    it('when given rubbish', () => {
      assert.isFalse(isJsonContentType('foo'));
    });
  });
});
