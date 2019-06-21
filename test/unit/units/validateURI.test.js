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

      it('has "null" validator', () => {
        expect(result).to.have.validator(null);
      });

      it('has "text/vnd.apiary.uri" real type', () => {
        expect(result).to.have.realType('text/vnd.apiary.uri');
      });

      it('has "text/vnd.apiary.uri" expected type', () => {
        expect(result).to.have.expectedType('text/vnd.apiary.uri');
      });

      it('has no errors', () => {
        expect(result.errors).to.have.length(0);
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

        it('has "null" validator', () => {
          expect(result).to.have.validator(null);
        });

        it('has "text/vnd.apiary.uri" real type', () => {
          expect(result).to.have.realType('text/vnd.apiary.uri');
        });

        it('has "text/vnd.apiary.uri" expected type', () => {
          expect(result).to.have.expectedType('text/vnd.apiary.uri');
        });

        it('has no errors', () => {
          expect(result.errors).to.have.length(0);
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

        it('has "null" validator', () => {
          expect(result).to.have.validator(null);
        });

        it('has "text/vnd.apiary.uri" real type', () => {
          expect(result).to.have.realType('text/vnd.apiary.uri');
        });

        it('has "text/vnd.apiary.uri" expected type', () => {
          expect(result).to.have.expectedType('text/vnd.apiary.uri');
        });

        it('has no errors', () => {
          expect(result.errors).to.have.length(0);
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

        it('has "null" validator', () => {
          expect(result).to.have.validator(null);
        });

        it('has "text/vnd.apiary.uri" real type', () => {
          expect(result).to.have.realType('text/vnd.apiary.uri');
        });

        it('has "text/vnd.apiary.uri" expected type', () => {
          expect(result).to.have.expectedType('text/vnd.apiary.uri');
        });

        it('has no errors', () => {
          expect(result.errors).to.have.length(0);
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

      it('has "null" validator', () => {
        expect(result).to.have.validator(null);
      });

      it('has "text/vnd.apiary.uri" real type', () => {
        expect(result).to.have.realType('text/vnd.apiary.uri');
      });

      it('has "text/vnd.apiary.uri" expected type', () => {
        expect(result).to.have.expectedType('text/vnd.apiary.uri');
      });

      describe('produces an error', () => {
        it('exactly one error', () => {
          expect(result.errors).to.have.length(1);
        });

        it('has explanatory message', () => {
          expect(result.errors[0]).to.have.property(
            'message',
            'Expected "uri" field to equal "/dashboard", but got: "/profile".'
          );
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

        it('has "null" validator', () => {
          expect(result).to.have.validator(null);
        });

        it('has "text/vnd.apiary.uri" real type', () => {
          expect(result).to.have.realType('text/vnd.apiary.uri');
        });

        it('has "text/vnd.apiary.uri" expected type', () => {
          expect(result).to.have.expectedType('text/vnd.apiary.uri');
        });

        describe('produces an error', () => {
          it('exactly one error', () => {
            expect(result.errors).to.have.length(1);
          });

          it('has explanatory message', () => {
            expect(result.errors[0]).to.have.property(
              'message',
              'Expected "uri" field to equal "/account?id=123", but got: "/account".'
            );
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

        it('has "null" validator', () => {
          expect(result).to.have.validator(null);
        });

        it('has "text/vnd.apiary.uri" real type', () => {
          expect(result).to.have.realType('text/vnd.apiary.uri');
        });

        it('has "text/vnd.apiary.uri" expected type', () => {
          expect(result).to.have.expectedType('text/vnd.apiary.uri');
        });

        describe('produces an error', () => {
          it('exactly one error', () => {
            expect(result.errors).to.have.length(1);
          });

          it('has explanatory message', () => {
            expect(result.errors[0]).to.have.property(
              'message',
              'Expected "uri" field to equal "/account?name=user", but got: "/account?nAmE=usEr".'
            );
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

        it('has "null" validator', () => {
          expect(result).to.have.validator(null);
        });

        it('has "text/vnd.apiary.uri" real type', () => {
          expect(result).to.have.realType('text/vnd.apiary.uri');
        });

        it('has "text/vnd.apiary.uri" expected type', () => {
          expect(result).to.have.expectedType('text/vnd.apiary.uri');
        });

        describe('produces an error', () => {
          it('exactly one error', () => {
            expect(result.errors).to.have.length(1);
          });

          it('has explanatory message', () => {
            expect(result.errors[0]).to.have.property(
              'message',
              'Expected "uri" field to equal "/zoo?type=cats&type=dogs", but got: "/zoo?type=dogs&type=cats".'
            );
          });
        });
      });
    });
  });
});
