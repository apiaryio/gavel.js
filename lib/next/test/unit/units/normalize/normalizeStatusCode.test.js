const { assert } = require('chai');
const {
  normalizeStatusCode
} = require('../../../../units/normalize/normalizeStatusCode');

describe('normalizeStatusCode', () => {
  describe('when given a string', () => {
    const normalized = normalizeStatusCode(' 400 ');

    it('returns a string', () => {
      assert.isString(normalized);
    });

    it('trims the value', () => {
      assert.equal(normalized, '400');
    });
  });

  describe('when given falsy value', () => {
    const values = [null, undefined];

    values.forEach((value) => {
      const normalized = normalizeStatusCode(value);

      it(`returns empty string when given ${value}`, () => {
        assert.equal(normalized, '');
      });
    });
  });
});
