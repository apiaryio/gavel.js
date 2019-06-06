const { assert } = require('chai');
const evolve = require('../../../lib/utils/evolve');

const multiply = (a) => (n) => n * a;
const unexpectedTypes = [
  ['number', 5],
  ['string', 'foo'],
  ['function', () => null],
  ['null', null],
  ['undefined', undefined]
];

describe('evolve', () => {
  describe('weak mode', () => {
    describe('evolves given object', () => {
      const result = evolve({
        a: multiply(2),
        c: () => null
      })({
        a: 2,
        b: 'foo'
      });

      it('returns object', () => {
        assert.isObject(result);
      });

      it('evolves matching properties', () => {
        assert.propertyVal(result, 'a', 4);
      });

      it('bypasses properties not in schema', () => {
        assert.propertyVal(result, 'b', 'foo');
      });

      it('ignores properties not in data', () => {
        assert.notProperty(result, 'c');
      });
    });

    describe('evolves given array', () => {
      const result = evolve({
        0: multiply(2),
        1: multiply(3),
        3: multiply(4)
      })([1, 2, 3]);

      it('returns array', () => {
        assert.isArray(result);
      });

      it('evolves matching properties', () => {
        assert.propertyVal(result, 0, 2);
        assert.propertyVal(result, 1, 6);
      });

      it('bypasses properties not in schema', () => {
        assert.propertyVal(result, 2, 3);
      });

      it('ignores properties not in data', () => {
        assert.notProperty(result, 3);
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

  describe('strict mode', () => {
    describe('evolves given object', () => {
      const result = evolve(
        {
          method: () => 'GET',
          headers: () => 'foo',
          body: multiply(2)
        },
        {
          strict: true
        }
      )({
        statusCode: 200,
        body: 5
      });

      it('returns an object', () => {
        assert.isObject(result);
      });

      it('evolves matching properties', () => {
        assert.propertyVal(result, 'body', 10);
      });

      it('forces all properties from schema', () => {
        assert.propertyVal(result, 'headers', 'foo');
        assert.propertyVal(result, 'method', 'GET');
      });

      it('bypasses properties not present in schema', () => {
        assert.propertyVal(result, 'statusCode', 200);
      });
    });
  });
});
