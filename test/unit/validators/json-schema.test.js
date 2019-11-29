/* eslint-disable */
const { assert } = require('chai');
const fixtures = require('../../fixtures');
const { JsonSchema } = require('../../../lib/validators/json-schema');
const {
  ValidationErrors
} = require('../../../lib/validators/validation-errors');
const shared = require('../support/amanda-to-gavel-shared');

describe('JsonSchema', () => {
  let validator = null;

  const dataForTypes = {
    string: {
      actual: fixtures.sampleJsonComplexKeyMissing,
      schema: fixtures.sampleJsonSchemaNonStrict
    },
    object: {
      actual: JSON.parse(fixtures.sampleJsonComplexKeyMissing),
      schema: JSON.parse(fixtures.sampleJsonSchemaNonStrict)
    }
  };

  const types = Object.keys(dataForTypes);
  types.forEach((type) => {
    const data = dataForTypes[type];

    describe(`when i create new instance of validator with "${type}" type arguments`, () => {
      let validator = null;

      beforeEach(() => {
        validator = new JsonSchema(data.schema);
      });

      it('should not throw an exception', () => {
        const fn = () => new JsonSchema(data.schema);
        assert.doesNotThrow(fn);
      });

      it('should parse schema to object', () => {
        assert.equal(typeof validator.jsonSchema, 'object');

        it('should parse schema to object which is json parsable', () => {
          assert.doesNotThrow(() => JSON.stringify(validator.jsonSchema));
        });

        describe('when I run validate()', () => {
          let errors = null;
          let errorsAgain = null;
          let errorsAfterDataChanged = null;

          beforeEach(() => {
            errors = validator.validate(data.actual);
          });

          it('should return some errors', () => {
            assert.notEqual(errors.length, 0);
          });

          describe('and run validate again', () => {
            before(() => {
              errorsAgain = validator.validate(data.actual);
            });

            it('errors should not change', () => {
              assert.deepEqual(
                JSON.parse(JSON.stringify(errorsAgain)),
                JSON.parse(JSON.stringify(errors))
              );
            });
          });

          describe('when i change data', () => {
            describe('and run validate again', () => {
              before(() => {
                errorsAfterDataChanged = validator.validate(
                  fixtures.sampleJson
                );
              });

              it('should not return any errors', () => {
                assert.equal(errorsAfterDataChanged.length, 0);
              });
            });
          });

          describe('when i change schema', () => {
            before(() => {
              validator.jsonSchema = JSON.parse(
                fixtures.sampleJsonSchemaNonStrict2
              );
            });

            describe('and run validate again', () => {
              errorsAfterDataChanged2 = null;

              before(() => {
                errorsAfterDataChanged2 = validator.validate(data.actual);
              });

              it('errors should change', () => {
                assert.notDeepEqual(
                  JSON.parse(JSON.stringify(errorsAfterDataChanged2)),
                  JSON.parse(JSON.stringify(errorsAfterDataChanged))
                );
              });
            });
          });
        });
      });

      // shared.shouldBehaveLikeAmandaToGavel(new JsonSchema('{}'));
    });

    describe('when validation performed on actual empty object', () => {
      it('should return some errors', () => {
        validator = new JsonSchema(
          JSON.parse(fixtures.sampleJsonSchemaNonStrict)
        );
        errors = validator.validate({});
        assert.notEqual(errors.length, 0);
      });
    });

    /**
     * @deprecate Stop testing implementation detail.
     */
    it('should have validateSchema method', () => {
      validator = new JsonSchema({});
      assert.isDefined(validator.validateSchema);
    });

    describe('when invalid JSON-stringified-data are provided', () => {
      const invalidStringifiedSchema = require('../../fixtures/invalid-stringified-schema');

      it('should throw an error for "data"', () => {
        const fn = () => {
          new JsonSchema(invalidStringifiedSchema);
        };
        assert.throw(fn);
      });

      it('should throw an error for "schema"', () => {
        const invalidStringifiedSchema = require('../../fixtures/invalid-stringified-schema');
        const fn = () => {
          new JsonSchema(invalidStringifiedSchema);
        };
        assert.throw(fn);
      });
    });

    describe('validate an object to check json_schema_options passed to Amanda', () => {
      let errors = null;
      let messagesLength = null;

      before(() => {
        messagesLength = Object.keys(
          fixtures.sampleJsonBodyTestingAmandaMessages
        ).length;
        validator = new JsonSchema(
          fixtures.sampleJsonSchemaTestingAmandaMessages
        );
        errors = validator.validate(
          fixtures.sampleJsonBodyTestingAmandaMessages
        );
      });

      it('contains all those schema defined messages', () => {
        assert.lengthOf(errors, messagesLength);
        assert.lengthOf(
          Object.keys(
            fixtures.sampleJsonSchemaTestingAmandaMessages.properties
          ),
          messagesLength
        );
        assert.lengthOf(errors, messagesLength);
      });
    });

    describe('validateSchema', () => {
      describe('with schema v3', () => {
        describe('when invalid schema provided', () => {
          let fn = null;

          before(() => {
            const invalidSchema = require('../../fixtures/invalid-schema-v3');
            fn = () => {
              validator = new JsonSchema(invalidSchema);
            };
          });

          it('should throw an error', () => {
            assert.throw(fn);
          });

          it('should mention schema v3 in the message', () => {
            try {
              fn();
            } catch (e) {
              assert.include(e.message, 'draftV3');
            }
          });
        });

        describe('when valid v3 schema provided', () => {
          let fn = null;
          before(() => {
            const validSchema = require('../../fixtures/valid-schema-v3');
            fn = () => {
              validator = new JsonSchema(validSchema);
            };
          });

          it('should not throw any error', () => {
            assert.doesNotThrow(fn);
          });

          it('should set @jsonSchemaVersion to v3', () => {
            fn();
            assert.equal(validator.jsonSchemaVersion, 'draftV3');
          });
        });
      });

      describe('with schema v4', () => {
        describe('when invalid v4 schema provided', () => {
          let fn = null;
          before(() => {
            const invalidSchema = require('../../fixtures/invalid-schema-v4');
            fn = () => {
              validator = new JsonSchema(invalidSchema);
            };
          });

          it('should throw an error', () => {
            assert.throw(fn);
          });

          it('should mention v4 in the error message', () => {
            try {
              fn();
            } catch (error) {
              assert.include(error.message, 'draftV4');
            }
          });
        });

        describe('when valid v4 schema provided', () => {
          let fn = null;
          before(() => {
            validSchema = require('../../fixtures/valid-schema-v4');
            fn = () => {
              validator = new JsonSchema(validSchema);
            };
          });

          it('should not throw any error', () => {
            assert.doesNotThrow(fn);
          });

          it('should set @jsonSchemaVersion to v4', () => {
            fn();
            assert.equal(validator.jsonSchemaVersion, 'draftV4');
          });
        });

        describe('with not identified version of schema', () => {
          describe('valid against v3 metaschema', () => {
            let fn = null;
            before(() => {
              validSchema = require('../../fixtures/valid-schema-v3');
              delete validSchema.$schema;
              fn = () => {
                validator = new JsonSchema(validSchema);
              };
            });

            it('should not throw any error', () => {
              assert.doesNotThrow(fn);
            });

            it('should set @jsonSchemaVersion to v3', () => {
              fn();
              assert.equal(validator.jsonSchemaVersion, 'draftV3');
            });
          });

          describe('valid against v4 metaschema', () => {
            let fn = null;
            before(() => {
              validSchema = require('../../fixtures/valid-schema-v4');
              delete validSchema.$schema;
              fn = () => {
                validator = new JsonSchema(validSchema);
              };
            });

            it('should not throw any error', () => {
              assert.doesNotThrow(fn);
            });

            it('should set @jsonSchemaVersion to v4', () => {
              fn();
              assert.equal(validator.jsonSchemaVersion, 'draftV4');
            });
          });

          describe('not valid against any metaschema', () => {
            let fn = null;
            before(() => {
              validSchema = require('../../fixtures/invalid-schema-v3-v4');
              delete validSchema.$schema;
              fn = () => {
                validator = new JsonSchema(validSchema);
              };
            });

            it('should throw an error', () => {
              assert.throw(fn);
            });

            it('should mention both v3 and v4 in the error message', () => {
              try {
                fn();
              } catch (error) {
                assert.include(error.message, 'draftV3');
                assert.include(error.message, 'draftV4');
              }
            });
          });
        });
      });
    });
  });
});
