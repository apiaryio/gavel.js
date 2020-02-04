const { expect } = require('../chai');
const { validate } = require('../../lib/validate');

describe('Root-level array validation', () => {
  describe('given an explicit JSON Schema', () => {
    const run = (actualBody) => {
      return validate(
        {
          headers: {
            'content-type': 'application/json'
          },
          bodySchema: JSON.stringify({
            $schema: 'http://json-schema.org/draft-07/schema#',
            type: 'array',
            items: {
              type: 'string'
            }
          })
        },
        {
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(actualBody)
        }
      );
    };

    describe('when actual data matches the schema', () => {
      let result;

      before(() => {
        result = run(['John', 'Alice']);
      });

      it('should be valid', () => {
        expect(result).to.be.valid;
      });
    });

    describe('when actual data does not match the schema', () => {
      let result;

      before(() => {
        result = run(['John', 23]);
      });

      it('should not be valid', () => {
        expect(result).not.to.be.valid;
      });

      it('should mark "body" field as invalid', () => {
        expect(result.fields.body).not.to.be.valid;
      });

      describe('should return an error', () => {
        it('should have exactly 1 error', () => {
          expect(result.fields.body).to.have.errors.lengthOf(1);
        });

        it('should have explanatory message', () => {
          expect(result.fields.body)
            .to.have.errorAtIndex(0)
            .withMessage(`At '/1' Invalid type: number (expected string)`);
        });

        describe('should have "location"', () => {
          it('with the "pointer" to "data/1"', () => {
            expect(result.fields.body.errors[0]).to.have.nested.property(
              'location.pointer',
              '/1'
            );
          });
        });
      });
    });
  });
});
