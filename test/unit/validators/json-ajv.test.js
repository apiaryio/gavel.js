const { assert } = require('chai');
const { JsonSchema } = require('../../../lib/validators/json-schema');
const jsonSchema4 = require('../../fixtures/valid-schema-v4');

describe('JSON Schema (AJV)', () => {
  describe('given JSON Schema Draft 4', () => {
    describe('and the data is valid', () => {
      let fn = null;
      let validator;

      before(() => {
        fn = () => {
          validator = new JsonSchema(jsonSchema4, {
            foo: 2,
            bar: 'a'
          });
        };
      });

      it('should not throw any error', () => {
        assert.doesNotThrow(fn);
      });

      it('should set @jsonSchemaVersion to v4', () => {
        fn();
        assert.equal(validator.jsonSchemaVersion, 'v4');
      });

      it('should not have any errors', () => {
        assert.notProperty(validator, 'errors');
      });
    });

    describe('and the data is invalid', () => {
      let fn = null;
      let validator;

      before(() => {
        fn = () => {
          validator = new JsonSchema(jsonSchema4, {
            bar: 'a'
          });
          validator.validate();
        };
      });

      it('should not throw any error', () => {
        assert.doesNotThrow(fn);
      });

      it('should set @jsonSchemaVersion to v4', () => {
        fn();
        assert.equal(validator.jsonSchemaVersion, 'v4');
      });

      describe('should return errors', () => {
        it('should have exactly one error', () => {
          assert.equal(validator.errors.length, 1);
        });

        it('should have a pointer', () => {
          assert.propertyVal(validator.errors[0].location, 'pointer', '/foo');
        });

        it('should have a property name', () => {
          assert.propertyVal(validator.errors[0].location, 'property', 'foo');
        });

        it('should have the error message about missing required property', () => {
          assert.propertyVal(
            validator.errors[0],
            'message',
            `'foo' is a required property`
          );
        });
      });
    });
  });
});
