const { expect } = require('../../chai');
const { validateURI } = require('../../../lib/units/validateURI');

describe('validateURI', () => {
  describe('given matching URI', () => {
    describe('without parameters', () => {
      const result = validateURI(
        {
          uri: '/dashboard'
        },
        {
          uri: '/dashboard'
        }
      );

      it('marks field as valid', () => {
        expect(result).to.be.valid;
      });

      it('has "text" kind', () => {
        expect(result).to.have.kind('text');
      });

      it('has no errors', () => {
        expect(result).to.not.have.errors;
      });
    });

    describe('with parameters', () => {
      describe('with exact parameters', () => {
        const result = validateURI(
          {
            uri: '/animals?type=cats'
          },
          {
            uri: '/animals?type=cats'
          }
        );

        it('marks field as valid', () => {
          expect(result).to.be.valid;
        });

        it('has "text" kind', () => {
          expect(result).to.have.kind('text');
        });

        it('has no errors', () => {
          expect(result).to.not.have.errors;
        });
      });

      describe('with exact parameters in different order', () => {
        // Order of different query params must not matter
        const result = validateURI(
          {
            uri: '/animals?type=cats&size=10'
          },
          {
            uri: '/animals?size=10&type=cats'
          }
        );

        it('mark field as valid', () => {
          expect(result).to.be.valid;
        });

        it('has "text" kind', () => {
          expect(result).to.have.kind('text');
        });

        it('has no errors', () => {
          expect(result).to.not.have.errors;
        });
      });

      describe('with multiple parameters in exact order', () => {
        // Order of the multiple same query params matters
        const result = validateURI(
          {
            uri: '/animals?type=cats&type=dogs'
          },
          {
            uri: '/animals?type=cats&type=dogs'
          }
        );

        it('marks field as valid', () => {
          expect(result).to.be.valid;
        });

        it('has "text" kind', () => {
          expect(result).to.have.kind('text');
        });

        it('has no errors', () => {
          expect(result).to.not.have.errors;
        });
      });
    });
  });

  describe('given non-matching URI', () => {
    describe('without parameters', () => {
      const result = validateURI(
        {
          uri: '/dashboard'
        },
        {
          uri: '/profile'
        }
      );

      it('marks field as invalid', () => {
        expect(result).to.not.be.valid;
      });

      it('has "text" kind', () => {
        expect(result).to.have.kind('text');
      });

      describe('produces an error', () => {
        it('exactly one error', () => {
          expect(result).to.have.errors.lengthOf(1);
        });

        it('has explanatory message', () => {
          expect(result)
            .to.have.errorAtIndex(0)
            .withMessage(`Expected URI '/dashboard', but got '/profile'.`);
        });

        it('includes values', () => {
          expect(result)
            .to.have.errorAtIndex(0)
            .withValues({
              expected: '/dashboard',
              actual: '/profile'
            });
        });
      });
    });

    describe('with parameters', () => {
      describe('with missing parameter', () => {
        const result = validateURI(
          {
            uri: '/account?id=123'
          },
          {
            uri: '/account'
          }
        );

        it('marks field is invalid', () => {
          expect(result).to.not.be.valid;
        });

        it('has "text" kind', () => {
          expect(result).to.have.kind('text');
        });

        describe('produces an error', () => {
          it('exactly one error', () => {
            expect(result).to.have.errors.lengthOf(1);
          });

          it('has explanatory message', () => {
            expect(result)
              .to.have.errorAtIndex(0)
              .withMessage(
                `Expected URI '/account?id=123', but got '/account'.`
              );
          });

          it('includes values', () => {
            expect(result)
              .to.have.errorAtIndex(0)
              .withValues({
                expected: '/account?id=123',
                actual: '/account'
              });
          });
        });
      });

      describe('with the same parameter in different case', () => {
        const result = validateURI(
          {
            uri: '/account?name=user'
          },
          {
            uri: '/account?nAmE=usEr'
          }
        );

        it('marks field is invalid', () => {
          expect(result).to.not.be.valid;
        });

        it('has "text" kind', () => {
          expect(result).to.have.kind('text');
        });

        describe('produces an error', () => {
          it('exactly one error', () => {
            expect(result).to.have.errors.lengthOf(1);
          });

          it('has explanatory message', () => {
            expect(result)
              .to.have.errorAtIndex(0)
              .withMessage(
                `Expected URI '/account?name=user', but got '/account?nAmE=usEr'.`
              );
          });

          it('includes values', () => {
            expect(result)
              .to.have.errorAtIndex(0)
              .withValues({
                expected: '/account?name=user',
                actual: '/account?nAmE=usEr'
              });
          });
        });
      });

      describe('with multiple parameters in wrong order', () => {
        const result = validateURI(
          {
            uri: '/zoo?type=cats&type=dogs'
          },
          {
            uri: '/zoo?type=dogs&type=cats'
          }
        );

        it('marks field is invalid', () => {
          expect(result).to.not.be.valid;
        });

        it('has "text" kind', () => {
          expect(result).to.have.kind('text');
        });

        describe('produces an error', () => {
          it('exactly one error', () => {
            expect(result).to.have.errors.lengthOf(1);
          });

          it('has explanatory message', () => {
            expect(result)
              .to.have.errorAtIndex(0)
              .withMessage(
                `Expected URI '/zoo?type=cats&type=dogs', but got '/zoo?type=dogs&type=cats'.`
              );
          });

          it('includes values', () => {
            expect(result)
              .to.have.errorAtIndex(0)
              .withValues({
                expected: '/zoo?type=cats&type=dogs',
                actual: '/zoo?type=dogs&type=cats'
              });
          });
        });
      });
    });
  });
});
