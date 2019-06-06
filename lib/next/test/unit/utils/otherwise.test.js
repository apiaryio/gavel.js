const { assert } = require('chai');
const otherwise = require('../../../utils/otherwise');

describe('otherwise', () => {
  describe('given existing value', () => {
    it('returns the given value', () => {
      const value = otherwise('')('foo');
      assert.equal(value, 'foo');
    });
  });

  describe('given non-exiting value', () => {
    it('returns fallback instead', () => {
      const value = otherwise('')(null);
      assert.equal(value, '');
    });
  });
});
