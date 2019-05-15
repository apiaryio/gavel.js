const { assert } = require('chai');
const mediaTyper = require('media-typer');
const { getBodySchemaType } = require('../../../../units/validateBody');

describe('getBodySchemaType', () => {
  describe('when given non-string schema', () => {
    // ...
  });

  describe('when given json schema', () => {
    describe('that contains object', () => {
      const res = getBodySchemaType('{ "foo": "bar" }');

      it('returns no errors', () => {
        assert.isNull(res[0]);
      });

      it('returns "application/schema+json" media type', () => {
        assert.deepEqual(res[1], mediaTyper.parse('application/schema+json'));
      });
    });

    describe('that contains array', () => {
      const res = getBodySchemaType('[1, 2, 3]');

      it('returns no errors', () => {
        assert.isNull(res[0]);
      });

      it('returns "application/schema+json" media type', () => {
        assert.deepEqual(res[1], mediaTyper.parse('application/schema+json'));
      });
    });
  });

  describe('when given non-json schema', () => {
    const res = getBodySchemaType('foo');

    it('returns parsing error', () => {
      assert.match(
        res[0],
        /^Can't validate. Expected body JSON Schema is not a parseable JSON:/
      );
    });

    it('returns no media type', () => [assert.isNull(res[1])]);
  });
});
