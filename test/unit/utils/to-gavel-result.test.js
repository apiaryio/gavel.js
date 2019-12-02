const { expect } = require('chai');
const toGavelResult = require('../../../lib/utils/to-gavel-result');

describe('toGavelResult', () => {
  // Currently TV4 output is coerced to Amanda format.
  // Then Amanda format is coerced to Gavel public API.
  describe('given Amanda errors', () => {
    let coercedErrors;

    before(() => {
      coercedErrors = toGavelResult({
        length: 2,
        0: {
          property: ['users', 'username'],
          propertyValue: 123,
          attributeName: 'type',
          attributeValue: 'string',
          message: 'Amanda error message'
        },
        1: {
          property: ['friends[2]', 'online'],
          propertyValue: false,
          attributeName: 'type',
          attributeValue: 'boolean',
          message: 'Arbitrary error message about "online"'
        }
      });
    });

    describe('given coerced to Gavel-compliant error', () => {
      it('should return 2 errors', () => {
        expect(coercedErrors).to.have.lengthOf(2);
      });

      describe('given in-object error', () => {
        it('should preserve the original error message', () => {
          expect(coercedErrors[0]).to.have.property(
            'message',
            'Amanda error message'
          );
        });

        describe('should produce "location" property', () => {
          it('should have "pointer"', () => {
            expect(coercedErrors[0]).to.have.nested.property(
              'location.pointer',
              '/users/username'
            );
          });

          it('should have "property"', () => {
            expect(coercedErrors[0].location.property).to.deep.equal([
              'users',
              'username'
            ]);
          });
        });
      });

      describe('given in-array error', () => {
        it('should preserve the original error message', () => {
          expect(coercedErrors[1]).to.have.property(
            'message',
            'Arbitrary error message about "online"'
          );
        });

        describe('should produce "location" property', () => {
          it('should have "pointer"', () => {
            expect(coercedErrors[1]).to.have.nested.property(
              'location.pointer',
              '/friends/2/online'
            );
          });

          it('should have "property"', () => {
            expect(coercedErrors[1].location.property).to.deep.equal([
              'friends',
              '2',
              'online'
            ]);
          });
        });
      });
    });
  });
});
