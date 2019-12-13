const { expect } = require('chai');
const {
  JsonSchemaLegacy
} = require('../../../lib/validators/json-schema-legacy');

const errorTypes = require('../../../lib/errors');
const invalidJsonSchema4 = require('../../fixtures/invalid-schema-v4');
const validJsonSchema4 = require('../../fixtures/valid-schema-v4');

describe('JSON Schema (legacy)', () => {
  /**
   * V4
   */
  describe('given JSON Schema Draft 4', () => {
    describe('and the schema is invalid', () => {
      let init;

      before(() => {
        init = () => new JsonSchemaLegacy(invalidJsonSchema4);
      });

      it('should throw an error about the invalid schema', () => {
        expect(init).to.throw(errorTypes.JsonSchemaNotValid);
      });
    });

    describe('and the schema is valid', () => {
      let init;
      let validator;

      before(() => {
        init = () => {
          validator = new JsonSchemaLegacy(validJsonSchema4);
        };
      });

      it('should not throw any errors', () => {
        expect(init).not.to.throw();
      });

      it('should recognize schema version as v4', () => {
        expect(validator).to.have.property('jsonSchemaVersion', 'draftV4');
      });

      describe('given validating data', () => {
        describe('and the data is invalid', () => {
          let errors;
          const data = {
            foo: 'should be number',
            bar: 'z'
          };

          before(() => {
            errors = validator.validate(data);
          });

          describe('should return validation errors', () => {
            it('should have 2 error', () => {
              expect(errors).to.have.lengthOf(2);
            });

            describe('first error', () => {
              it('should have an error message', () => {
                expect(errors[0].message).to.equal(
                  `At '/foo' Invalid type: string (expected number)`
                );
              });

              it('should have a pointer', () => {
                expect(errors[0]).to.have.nested.property(
                  'location.pointer',
                  '/foo'
                );
              });

              it('should have a property name', () => {
                expect(errors[0].location.property).to.deep.equal(['foo']);
              });
            });

            describe('second error', () => {
              it('should have an error message', () => {
                expect(errors[1].message).to.equal(
                  `At '/bar' No enum match for: "z"`
                );
              });

              it('should have a pointer', () => {
                expect(errors[1]).to.have.nested.property(
                  'location.pointer',
                  '/bar'
                );
              });

              it('should have a property name', () => {
                expect(errors[1].location.property).to.deep.equal(['bar']);
              });
            });
          });
        });

        describe('and the data is valid', () => {
          let errors;
          const data = {
            foo: 123,
            bar: 'a'
          };

          before(() => {
            errors = validator.validate(data);
          });

          it('should return no errors', () => {
            expect(errors).to.have.lengthOf(0);
          });
        });
      });
    });
  });
});
