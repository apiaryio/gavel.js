const { assert } = require('chai');
const mediaTyper = require('media-typer');
const { getBodySchemaType } = require('../../../../lib/units/validateBody');

describe('getBodySchemaType', () => {
  describe('when given non-string schema', () => {
    const values = [
      ['number', 123],
      ['object', { foo: 'bar' }],
      ['array', [1, 2, 3]],
      ['null', null],
      ['undefined', undefined]
    ];

    values.forEach(([name, value]) => {
      describe(`which is ${name}`, () => {
        const [error, mediaType] = getBodySchemaType(value);

        it('returns "application/schema+json" media type', () => {
          assert.deepEqual(
            mediaType,
            mediaTyper.parse('application/schema+json')
          );
        });

        it('has no errors', () => {
          assert.isNull(error);
        });
      });
    });
  });

  describe('when given JSON', () => {
    const jsonSchemas = [
      ['object', '{ "foo": "bar" }'],
      ['array', '[1, 2, 3]']
    ];

    jsonSchemas.forEach(([name, jsonSchema]) => {
      describe(`that contains ${name}`, () => {
        const [error, mediaType] = getBodySchemaType(jsonSchema);

        it('returns "application/schema+json" media type', () => {
          assert.deepEqual(
            mediaType,
            mediaTyper.parse('application/schema+json')
          );
        });

        it('returns no errors', () => {
          assert.isNull(error);
        });
      });
    });
  });

  describe('when given non-JSON string', () => {
    const [error, mediaType] = getBodySchemaType('foo');

    it('returns no media type', () => {
      assert.isNull(mediaType);
    });

    it('returns parsing error', () => {
      assert.match(
        error,
        /^Can't validate: expected body JSON Schema is not a parseable JSON:/
      );
    });
  });
});
