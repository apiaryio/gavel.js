const { expect } = require('chai');
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
          expect(mediaType).to.deep.equal(
            mediaTyper.parse('application/schema+json')
          );
        });

        it('has no errors', () => {
          expect(error).to.be.null;
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
          expect(mediaType).to.deep.equal(
            mediaTyper.parse('application/schema+json')
          );
        });

        it('returns no errors', () => {
          expect(error).to.be.null;
        });
      });
    });
  });

  describe('when given non-JSON string', () => {
    const run = () => getBodySchemaType('foo');

    it('throws exception about invalid JSON', () => [
      expect(run).to.throw(
        /^Failed to validate HTTP message "body": given JSON Schema is not a valid JSON/
      )
    ]);
  });
});
