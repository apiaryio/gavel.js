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

    describe(
      'when i create new instance of validator with "' +
        type +
        '" type arguments',
      () => {
        let validator = null;

        beforeEach(() => {
          validator = new JsonSchema(data.schema, data.actual);
        });

        it('should not throw an exception', () => {
          const fn = () => {
            new JsonSchema(data.schema, data.actual);
          };
          assert.doesNotThrow(fn);
        });

        it('should set data to object', () => {
          assert.equal(typeof validator.data, 'object');
        });

        it('should parse data to object which is json parsable', () => {
          assert.doesNotThrow(() => JSON.stringify(validator.data));
        });

        it('should parse schema to object', () => {
          assert.equal(typeof validator.schema, 'object');

          it('should parse schema to object which is json parsable', () => {
            assert.doesNotThrow(() => JSON.stringify(validator.schema));
          });

          describe('when I run validate()', () => {
            let validatorReturn = null;
            let validatorReturnAgain = null;
            let validatorReturnAfterDataChanged = null;

            beforeEach(() => {
              validatorReturn = validator.validate();
            });

            it('should set @errors', () => {
              assert.isTrue(validator.errors instanceof ValidationErrors);
            });

            it('should return some errors', () => {
              assert.notEqual(validatorReturn.length, 0);
            });

            describe('and run validate again', () => {
              before(() => {
                validatorReturnAgain = validator.validate();
              });

              it('errors should not change', () => {
                assert.deepEqual(
                  JSON.parse(JSON.stringify(validatorReturnAgain)),
                  JSON.parse(JSON.stringify(validatorReturn))
                );
              });
            });

            describe('when i change data', () => {
              before(() => {
                validator.data = JSON.parse(fixtures.sampleJson);
              });

              describe('and run validate again', () => {
                before(() => {
                  validatorReturnAfterDataChanged = validator.validate();
                });
                it('errors should change', () => {
                  assert.equal(validatorReturnAfterDataChanged.length, 0);
                });
              });
            });

            describe('when i change schema', () => {
              before(() => {
                validator.schema = JSON.parse(
                  fixtures.sampleJsonSchemaNonStrict2
                );
              });

              describe('and run validate again', () => {
                validatorReturnAfterDataChanged2 = null;
                before(() => {
                  validatorReturnAfterDataChanged2 = validator.validate();
                });

                it('errors should change', () => {
                  assert.notDeepEqual(
                    JSON.parse(
                      JSON.stringify(validatorReturnAfterDataChanged2)
                    ),
                    JSON.parse(JSON.stringify(validatorReturnAfterDataChanged))
                  );
                });
              });
            });
          });
        });

        shared.shouldBehaveLikeAmandaToGavel(new JsonSchema('{}', '{}'));
      }
    );

    describe('when validation performed on actual empty object', () => {
      it('should return some errors', () => {
        validator = new JsonSchema(
          JSON.parse(fixtures.sampleJsonSchemaNonStrict),
          {}
        );
        result = validator.validate();
        assert.notEqual(validator.validate().length, 0);
      });
    });

    it('should have validateSchema method', () => {
      validator = new JsonSchema({}, {});
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
          new JsonSchema(invalidStringifiedSchema, {});
        };
        assert.throw(fn);
      });
    });

    describe('validate an object to check json_schema_options passed to Amanda', () => {
      let results = null;
      let error = null;
      let messagesLength = null;

      before(() => {
        messagesLength = Object.keys(
          fixtures.sampleJsonBodyTestingAmandaMessages
        ).length;
        validator = new JsonSchema(
          fixtures.sampleJsonSchemaTestingAmandaMessages,
          fixtures.sampleJsonBodyTestingAmandaMessages
        );
        results = validator.validate();
      });

      it('contains all those schema defined messages', () => {
        assert.isNull(error);
        assert.isObject(results);
        assert.lengthOf(
          Object.keys(
            fixtures.sampleJsonSchemaTestingAmandaMessages.properties
          ),
          messagesLength
        );
        assert.propertyVal(results, 'length', messagesLength);
        assert.lengthOf(results, messagesLength);
      });
    });

    describe('validateSchema', () => {
      describe('with schema v3', () => {
        describe('when invalid schema provided', () => {
          let fn = null;

          before(() => {
            const invalidSchema = require('../../fixtures/invalid-schema-v3');
            fn = () => {
              validator = new JsonSchema(invalidSchema, {});
            };
          });

          it('should throw an error', () => {
            assert.throw(fn);
          });

          it('should mention schema v3 in the message', () => {
            try {
              fn();
            } catch (e) {
              assert.include(e.message, 'v3');
            }
          });
        });

        describe('when valid v3 schema provided', () => {
          let fn = null;
          before(() => {
            const validSchema = require('../../fixtures/valid-schema-v3');
            fn = () => {
              validator = new JsonSchema(validSchema, {});
            };
          });

          it('should not throw any error', () => {
            assert.doesNotThrow(fn);
          });

          it('should set @jsonSchemaVersion to v3', () => {
            fn();
            assert.equal(validator.jsonSchemaVersion, 'v3');
          });
        });
      });

      describe('with schema v4', () => {
        describe('when invalid v4 schema provided', () => {
          let fn = null;
          before(() => {
            const invalidSchema = require('../../fixtures/invalid-schema-v4');
            fn = () => {
              validator = new JsonSchema(invalidSchema, {});
            };
          });

          it('should throw an error', () => {
            assert.throw(fn);
          });

          it('should mention v4 in the error message', () => {
            try {
              fn();
            } catch (error) {
              assert.include(error.message, 'v4');
            }
          });
        });

        describe('when valid v4 schema provided', () => {
          let fn = null;
          before(() => {
            validSchema = require('../../fixtures/valid-schema-v4');
            fn = () => {
              validator = new JsonSchema(validSchema, {});
            };
          });

          it('should not throw any error', () => {
            assert.doesNotThrow(fn);
          });

          it('should set @jsonSchemaVersion to v4', () => {
            fn();
            assert.equal(validator.jsonSchemaVersion, 'v4');
          });
        });

        describe('with not identified version of schema', () => {
          describe('valid against v3 metaschema', () => {
            let fn = null;
            before(() => {
              validSchema = require('../../fixtures/valid-schema-v3');
              delete validSchema['$schema'];
              fn = () => {
                validator = new JsonSchema(validSchema, {});
              };
            });

            it('should not throw any error', () => {
              assert.doesNotThrow(fn);
            });

            it('should set @jsonSchemaVersion to v3', () => {
              fn();
              assert.equal(validator.jsonSchemaVersion, 'v3');
            });
          });

          describe('valid against v4 metaschema', () => {
            let fn = null;
            before(() => {
              validSchema = require('../../fixtures/valid-schema-v4');
              delete validSchema['$schema'];
              fn = () => {
                validator = new JsonSchema(validSchema, {});
              };
            });

            it('should not throw any error', () => {
              assert.doesNotThrow(fn);
            });

            it('should set @jsonSchemaVersion to v4', () => {
              fn();
              assert.equal(validator.jsonSchemaVersion, 'v4');
            });
          });

          describe('not valid against any metaschema', () => {
            let fn = null;
            before(() => {
              validSchema = require('../../fixtures/invalid-schema-v3-v4');
              delete validSchema['$schema'];
              fn = () => {
                validator = new JsonSchema(validSchema, {});
              };
            });

            it('should throw an error', () => {
              assert.throw(fn);
            });

            it('should mention both v3 and v4 in the error message', () => {
              try {
                fn();
              } catch (error) {
                assert.include(error.message, 'v3');
                assert.include(error.message, 'v4');
              }
            });
          });
        });
      });
    });
  });
});
