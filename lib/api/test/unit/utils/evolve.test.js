const { assert } = require('chai');
const evolve = require('../../../utils/evolve');

const multiply = (a) => (n) => n * a;
const unexpectedTypes = [
  ['number', 5],
  ['string', 'foo'],
  ['function', () => null],
  ['null', null],
  ['undefined', undefined]
];

describe('evolve', () => {
  describe('evolves a given object', () => {
    const res = evolve({
      a: multiply(2),
      c: () => null
    })({
      a: 2,
      b: 'foo'
    });

    it('evolves matching properties', () => {
      assert.propertyVal(res, 'a', 4);
    });

    it('bypasses properties not in schema', () => {
      assert.propertyVal(res, 'b', 'foo');
    });

    it('ignores properties not in data', () => {
      assert.notProperty(res, 'c');
    });
  });

  describe('evolves a given array', () => {
    const res = evolve({
      0: multiply(2),
      1: multiply(3),
      3: multiply(4)
    })([1, 2, 3]);

    it('evolves matching keys', () => {
      assert.propertyVal(res, 0, 2);
      assert.propertyVal(res, 1, 6);
    });

    it('bypasses keys not in schema', () => {
      assert.propertyVal(res, 2, 3);
    });

    it('ignores properties not in data', () => {
      assert.notProperty(res, 3);
    });
  });

  describe('throws when given unexpected schema', () => {
    unexpectedTypes
      .concat([['array', [1, 2]]])
      .forEach(([typeName, dataType]) => {
        it(`when given ${typeName}`, () => {
          assert.throw(() => evolve(dataType)({}));
        });
      });
  });

  describe('throws when given unexpected data', () => {
    unexpectedTypes.forEach(([typeName, dataType]) => {
      it(`when given ${typeName}`, () => {
        assert.throw(() => evolve({ a: () => null })(dataType));
      });
    });
  });
});
