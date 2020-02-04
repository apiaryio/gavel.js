/**
 * Previously validation of JSON Schema Draft 3 schemas ignored
 * the ".allOf" property, which resulted into unexpected validation result.
 * @see https://github.com/apiaryio/dredd/issues/1647
 */
const { expect } = require('../chai');
const gavel = require('../../lib');

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  allOf: [
    {
      type: 'object',
      required: ['id', 'body'],
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        }
      }
    },
    {
      additionalProperties: false,
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        },
        body: {
          type: 'string'
        },
        additional_details: {
          type: 'object',
          'x-nullable': true
        },
        additional_equipment: {
          type: 'array',
          'x-nullable': true
        }
      }
    }
  ]
};

describe('JSON Schema with "additionalProperties" and "allOf"', () => {
  describe('given a detached JSON Schema with "allOf"', () => {
    describe('and the actual body matches the schema', () => {
      let result;

      before(() => {
        result = gavel.validate(
          {
            bodySchema: schema
          },
          {
            body: JSON.stringify({
              id: '123e4567-e89b-12d3-a456-426655440000',
              body: 'any'
            })
          }
        );
      });

      it('should be valid', () => {
        expect(result).to.be.valid;
      });

      it('should not have any errors', () => {
        expect(result.fields.body).to.not.have.errors;
      });
    });

    describe('and the actual body does not match the schema', () => {
      let result;

      before(() => {
        result = gavel.validate(
          {
            bodySchema: schema
          },
          {
            body: JSON.stringify({
              id: 2 // invalid type
            })
          }
        );
      });

      it('should not be valid', () => {
        expect(result).not.to.be.valid;
      });

      it('should have exactly 3 errors', () => {
        expect(result.fields.body).to.have.errors.lengthOf(3);
      });

      describe('given missing property error', () => {
        it('should have an error message about a missing "body" property', () => {
          expect(result.fields.body)
            .to.have.errorAtIndex(0)
            .withMessage(`At '/body' Missing required property: body`);
        });

        it('should have a verbose error location', () => {
          expect(result.fields.body)
            .to.have.errorAtIndex(0)
            .withLocation({
              pointer: '/body',
              property: ['body']
            });
        });
      });

      describe('given invalid type error', () => {
        it('should have an error message about invalid "id" type', () => {
          expect(result.fields.body)
            .to.have.errorAtIndex(1)
            .withMessage(`At '/id' Invalid type: number (expected string)`);
        });

        it('should have a verbose error location', () => {
          expect(result.fields.body)
            .to.have.errorAtIndex(1)
            .withLocation({
              pointer: '/id',
              property: ['id']
            });
        });
      });

      describe('given another invalid type error', () => {
        it('should have an error message about invalid "id" type', () => {
          expect(result.fields.body)
            .to.have.errorAtIndex(2)
            .withMessage(`At '/id' Invalid type: number (expected string)`);
        });

        it('should have a verbose error location', () => {
          expect(result.fields.body)
            .to.have.errorAtIndex(2)
            .withLocation({
              pointer: '/id',
              property: ['id']
            });
        });
      });
    });
  });
});
