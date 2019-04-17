const { assert } = require('chai');
const getType = require('../../../src/utils/get-type.js');

describe('getType', () => {
  describe('can handle native javascript object types', () => {
    it('when given Array', () => {
      assert.equal(getType([1, 2]), 'array');
    });

    it('when given Date', () => {
      assert.equal(getType(new Date()), 'date');
    });

    it('when given Function', () => {
      func = () => 'foo';
      assert.equal(getType(func), 'function');
    });

    it('when given Number', () => {
      assert.equal(getType(1), 'number');
    });

    it('when given RegExp', () => {
      assert.equal(getType(new RegExp(/foo/)), 'regexp');
    });

    it('when given String', () => {
      assert.equal(getType('foo'), 'string');
    });

    describe('can handle explicit scenarios', () => {
      it('when given null', () => {
        assert.equal(getType(null), 'null');
      });

      it('when given undefined', () => {
        assert.equal(getType(undefined), 'undefined');
      });

      it('when given Object', () => {
        assert.equal(getType({}), 'object');
      });
    });

    it('returns type as-is for unknown types', () => {
      customInstance = Buffer.alloc(1);
      assert.equal(getType(customInstance), 'object');
    });
  });
});
