const { expect } = require('chai');
const {
  JsonSchemaValidator
} = require('../../../lib/validators/json-schema-next');

const errorTypes = require('../../../lib/errors');
const invalidJsonSchema4 = require('../../fixtures/invalid-schema-v4');
const validJsonSchema4 = require('../../fixtures/valid-schema-v4');
const invalidJsonSchema6 = require('../../fixtures/invalid-schema-v6');
const validJsonSchema6 = require('../../fixtures/valid-schema-v6');
const invalidJsonSchema7 = require('../../fixtures/invalid-schema-v7');
const validJsonSchema7 = require('../../fixtures/valid-schema-v7');
const validJsonSchema7Boolean = require('../../fixtures/valid-schema-v7-boolean');

describe('JSON Schema (next)', () => {
  /**
   * Unsupported version
   */
  describe('given unsupported JSON Schema Draft version', () => {
    let init;

    before(() => {
      /* eslint-disable-next-line global-require */
      const validSchema = require('../../fixtures/invalid-schema-v3-v4.json');
      delete validSchema.$schema;

      init = () => {
        return new JsonSchemaValidator(validSchema);
      };
    });

    it('should throw an error about unsupported schema version', () => {
      expect(init).to.throw(errorTypes.JsonSchemaNotSupported);
    });
  });

  /**
   * Draft 4
   */
  describe('given JSON Schema Draft 4', () => {
    describe('and the schema is invalid', () => {
      let init;

      before(() => {
        init = () => new JsonSchemaValidator(invalidJsonSchema4);
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
          validator = new JsonSchemaValidator(validJsonSchema4);
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
            it('should have 2 errors', () => {
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

  /**
   * Draft 6
   */
  describe('given JSON Schema Draft 6', () => {
    describe('and the schema is invalid', () => {
      let init;

      before(() => {
        init = () => new JsonSchemaValidator(invalidJsonSchema6);
      });

      it('should throw an error about invalid schema', () => {
        expect(init).to.throw(errorTypes.JsonSchemaNotValid);
      });
    });

    describe('and the schema is valid', () => {
      let init;
      let validator;

      before(() => {
        init = () => {
          validator = new JsonSchemaValidator(validJsonSchema6);
        };
      });

      it('should not throw any errors', () => {
        expect(init).not.to.throw();
      });

      it('should recognize schema version as v6', () => {
        expect(validator).to.have.property('jsonSchemaVersion', 'draftV6');
      });

      describe('given validating data', () => {
        describe('and the data is valid', () => {
          let errors;
          const data = {
            foo: 23
          };

          before(() => {
            errors = validator.validate(data);
          });

          it('should not return any errors', () => {
            expect(errors).to.have.lengthOf(0);
          });
        });

        describe('and the data is invalid', () => {
          let errors;
          const data = {
            foo: 'should be number'
          };

          before(() => {
            errors = validator.validate(data);
          });

          describe('should return errors', () => {
            it('should return exactly one error', () => {
              expect(errors).to.have.lengthOf(1);
            });

            it('should contain the error message', () => {
              expect(errors[0]).to.have.property(
                'message',
                `At '/foo' Invalid type: string (expected number)`
              );
            });

            it('should contain the pointer', () => {
              expect(errors[0]).to.have.nested.property(
                'location.pointer',
                '/foo'
              );
            });

            it('should contain the property name', () => {
              expect(errors[0].location.property).to.deep.equal(['foo']);
            });
          });
        });
      });
    });
  });

  /**
   * Draft 7
   */
  describe('given JSON Schema Draft 7', () => {
    describe('and the schema is invalid', () => {
      let init;

      before(() => {
        init = () => new JsonSchemaValidator(invalidJsonSchema7);
      });

      it('should throw an error about invalid schema', () => {
        expect(init).to.throw(errorTypes.JsonSchemaNotValid);
      });
    });

    describe('and the schema is valid', () => {
      let init;
      let validator;

      before(() => {
        init = () => {
          validator = new JsonSchemaValidator(validJsonSchema7);
        };
      });

      it('should not throw any errors', () => {
        expect(init).not.to.throw();
      });

      it('should recognize schema version as v7', () => {
        expect(validator).to.have.property('jsonSchemaVersion', 'draftV7');
      });

      describe('given validating data', () => {
        describe('and the data is valid', () => {
          let errors;
          const data = {
            foo: 'valid-value'
          };

          before(() => {
            errors = validator.validate(data);
          });

          it('should not return any errors', () => {
            expect(errors).to.have.lengthOf(0);
          });
        });

        describe('and the data is invalid', () => {
          let errors;
          const data = {
            foo: 3
          };

          before(() => {
            errors = validator.validate(data);
          });

          describe('should return errors', () => {
            it('should return exactly one error', () => {
              expect(errors).to.have.lengthOf(1);
            });

            it('should contain the error message', () => {
              expect(errors[0]).to.have.property(
                'message',
                'data/foo should NOT be valid'
              );
            });

            it('should contain the pointer', () => {
              expect(errors[0]).to.have.nested.property(
                'location.pointer',
                '/foo'
              );
            });

            it('should contain the property name', () => {
              expect(errors[0].location.property).to.deep.equal(['foo']);
            });
          });
        });
      });
    });
  });

  /**
   * Inferred JSON Schema version for boolean value schema.
   */
  describe('given a JSON Schema with a boolean value', () => {
    let validator;

    before(() => {
      validator = new JsonSchemaValidator(validJsonSchema7Boolean);
    });

    it('should infer schema version as "draft7"', () => {
      expect(validator).to.have.property('jsonSchemaVersion', 'draftV7');
    });
  });
});
