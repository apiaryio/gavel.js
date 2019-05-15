const { assert } = require('chai');
const normalizeHeaders = require('../../../../units/normalize/normalizeHeaders');

describe('normalizeHeaders', () => {
  describe('when given nothing', () => {
    const headers = normalizeHeaders(undefined);

    it('coerces to empty object', () => {
      assert.deepEqual(headers, {});
    });
  });

  describe('when given headers object', () => {
    const headers = {
      'Accept-Language': 'en-US, en',
      'Content-Type': 'application/json',
      'Content-Length': 128
    };
    const normalizedHeaders = normalizeHeaders(headers);

    it('lowercases the keys', () => {
      const expectedKeys = Object.keys(headers).map((key) => key.toLowerCase());
      assert.hasAllKeys(normalizedHeaders, expectedKeys);
    });

    it('lowercases the values', () => {
      const expectedValues = Object.values(headers).map((value) =>
        typeof value === 'string' ? value.toLowerCase() : value
      );
      assert.deepEqual(Object.values(normalizedHeaders), expectedValues);
    });
  });

  describe('when given non-object headers', () => {
    const unsupportedTypes = [['string', 'foo'], ['number', 2]];

    unsupportedTypes.forEach(([typeName, dataType]) => {
      it(`when given ${typeName}`, () => {
        assert.throw(() => normalizeHeaders(dataType));
      });
    });
  });
});
