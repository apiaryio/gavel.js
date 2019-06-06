const { assert } = require('chai');
const { validateURI } = require('../../../lib/units/validateURI');

describe('validateURI', () => {
  describe('given matching URI', () => {
    const result = validateURI(
      {
        uri: '/dashboard'
      },
      {
        uri: '/dashboard'
      }
    );

    it('marks field as valid', () => {
      assert.propertyVal(result, 'isValid', true);
    });

    it('has "null" validator', () => {
      assert.propertyVal(result, 'validator', null);
    });

    it('has "text/vnd.apiary.uri" real type', () => {
      assert.propertyVal(result, 'realType', 'text/vnd.apiary.uri');
    });

    it('has "text/vnd.apiary.uri" expected type', () => {
      assert.propertyVal(result, 'expectedType', 'text/vnd.apiary.uri');
    });

    it('has no errors', () => {
      assert.lengthOf(result.errors, 0);
    });
  });

  describe('given non-matching URI', () => {
    const result = validateURI(
      {
        uri: '/dashboard'
      },
      {
        uri: '/profile'
      }
    );

    it('marks field as invalid', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    it('has "null" validator', () => {
      assert.propertyVal(result, 'validator', null);
    });

    it('has "text/vnd.apiary.uri" real type', () => {
      assert.propertyVal(result, 'realType', 'text/vnd.apiary.uri');
    });

    it('has "text/vnd.apiary.uri" expected type', () => {
      assert.propertyVal(result, 'expectedType', 'text/vnd.apiary.uri');
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        assert.lengthOf(result.errors, 1);
      });

      it('has explanatory message', () => {
        assert.propertyVal(
          result.errors[0],
          'message',
          'Expected "uri" field to equal "/dashboard", but got "/profile".'
        );
      });
    });
  });
});
