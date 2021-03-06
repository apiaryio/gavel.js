/* eslint-disable */
const { assert } = require('chai');
const { JsonExample } = require('../../../lib/validators/json-example');
const fixtures = require('../../fixtures');

describe('JsonExample', () => {
  bodyValidator = {};

  describe('constructor', () => {
    describe('when I provide non string real data', () => {
      it('should throw exception', () => {
        const fn = () => {
          bodyValidator = new JsonExample("{'header1': 'value1'}", {
            malformed: 'malformed '
          });
        };
        assert.throws(fn);
      });
    });

    describe('when I provide string as real with JSONized string', () => {
      it('should not throw exception', () => {
        fn = () => {
          bodyValidator = new JsonExample('{"header1": "value1"}');
        };
        assert.doesNotThrow(fn);
      });
    });

    describe('when I provide string as expected and real with JSONized string', () => {
      it('should not throw exception', () => {
        const fn = () => {
          bodyValidator = new JsonExample(
            '"Number of profiles deleted: com.viacom.auth.infrastructure.DocumentsUpdated@1"'
          );
        };
        assert.doesNotThrow(fn);
      });
    });

    describe('when I provide non string expected data', () => {
      it('should throw exception', () => {
        const fn = () => {
          bodyValidator = new JsonExample(
            "{'header1': 'value1'}",
            { malformed: 'malformed ' },
            { schema: null }
          );
        };
        assert.throws(fn);
      });
    });

    describe('when I provide correct data', () => {
      it('should not throw exception', () => {
        const fn = () => {
          bodyValidator = new JsonExample('{"header1": "value1"}');
        };
        assert.doesNotThrow(fn);
      });
    });

    describe('when expected and real data are json parsable', () => {
      before(() => {
        bodyValidator = new JsonExample(fixtures.sampleJson);
      });

      describe('when provided real and expected data are the same', () => {
        before(() => {
          bodyValidator = new JsonExample(fixtures.sampleJson);
        });
        describe('and i run validate()', () => {
          it("shouldn't return any errors", () => {
            result = bodyValidator.validate(fixtures.sampleJson);
            assert.equal(result.length, 0);
          });
        });
      });
    });

    describe('when key is missing in provided real data', () => {
      before(() => {
        bodyValidator = new JsonExample(fixtures.sampleJson);
      });
      describe('and i run validate()', () => {
        it('should return 1 errors', () => {
          result = bodyValidator.validate(fixtures.sampleJsonSimpleKeyMissing);
          assert.equal(result.length, 1);
        });
      });

      describe.skip('when value has different primitive type', () => {
        before(() => {
          bodyValidator = new JsonExample('{"a": 1}', '{"a": "a"}');
        });
        describe('and i run validate()', () => {
          it('PROPOSAL: should return 1 errors', () => {
            result = bodyValidator.validate();
            assert.equal(result.length, 1);
          });
        });
      });

      describe('when value in provided and expected data differs', () => {
        before(() => {
          bodyValidator = new JsonExample(
            fixtures.sampleJsonSimpleKeyValueDiffers
          );
        });
        describe('and i run validate()', () => {
          it("shouldn't return any errors", () => {
            result = bodyValidator.validate(fixtures.sampleJson);
            assert.equal(result.length, 0);
          });
        });
      });

      describe('when key is added to provided data', () => {
        before(() => {
          bodyValidator = new JsonExample(fixtures.sampleJson);
        });
        describe('and i run validate()', () => {
          it("shouldn't return any errors", () => {
            result = bodyValidator.validate(fixtures.sampleJsonComplexKeyAdded);
            assert.equal(result.length, 0);
          });
        });
      });

      describe('when key value is a empty string', () => {
        before(() => {
          bodyValidator = new JsonExample(fixtures.emptyStringJson);
        });
        describe('and i run validate()', () => {
          it("shouldn't return any errors", () => {
            result = bodyValidator.validate(fixtures.emptyStringJson);
            assert.equal(result.length, 0);
          });
        });
      });

      describe('when key value is a null', () => {
        before(() => {
          bodyValidator = new JsonExample('{"a":"a", "b": null}');
        });
        describe('and i run validate()', () => {
          it("shouldn't return any errors", () => {
            result = bodyValidator.validate('{"a": "a","b": null }');
            assert.equal(result.length, 0);
          });
        });
      });

      describe('when expected and real data are different on root level', () => {
        describe('when expected is object and real is array', () => {
          before(() => {
            bodyValidator = new JsonExample('{"a":1}');
          });
          describe('and i run validate()', () => {
            it('should not throw exception', () => {
              const fn = () => {
                bodyValidator.validate('[{"a":1}]');
              };
              assert.doesNotThrow(fn);
            });
          });
        });
      });

      describe('when expected is array and real is object', () => {
        before(() => {
          bodyValidator = new JsonExample('[{"a":1}]');
        });
        describe('and i run validate()', () => {
          it('should not throw exception', () => {
            const fn = () => {
              bodyValidator.validate('{"a":1}');
            };
            assert.doesNotThrow(fn);
          });
        });
      });

      describe('when expected is primitive and real is object', () => {
        before(() => {
          bodyValidator = new JsonExample('{"a":1}');
        });
        describe('and i run validate()', () => {
          it('should not throw exception', () => {
            const fn = () => {
              bodyValidator.validate('0');
            };
            assert.doesNotThrow(fn);
          });
        });
      });

      describe('when expected array and real is object', () => {
        before(() => {
          bodyValidator = new JsonExample('{"a":1}');
        });
        describe('and i run validate()', () => {
          it('should not throw exception', () => {
            const fn = () => {
              bodyValidator.validate('[0,1,2]');
            };
            assert.doesNotThrow(fn);
          });
        });
      });

      describe('when real is empty object and expected is non-empty object', () => {
        before(() => {
          bodyValidator = new JsonExample('{"a":1}');
        });

        describe('and i run validate()', () => {
          it('should not throw exception', () => {
            const fn = () => {
              bodyValidator.validate('{}');
            };
            assert.doesNotThrow(fn);
          });
        });

        it('should return 1 errors', () => {
          result = bodyValidator.validate('{}');
          assert.equal(result.length, 1);
        });
      });
    });
  });
});
