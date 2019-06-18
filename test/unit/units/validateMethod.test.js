const { assert } = require('chai');
const { validateMethod } = require('../../../lib/units/validateMethod');

describe('validateMethod', () => {
  describe('given matching methods', () => {
    const result = validateMethod(
      {
        method: 'GET'
      },
      {
        method: 'GET'
      }
    );

    it('has "isValid" as "true"', () => {
      assert.propertyVal(result, 'isValid', true);
    });

    it('has "null" validator', () => {
      assert.isNull(result.validator);
    });

    it('has "text/vnd.apiary.method" real type', () => {
      assert.propertyVal(result, 'realType', 'text/vnd.apiary.method');
    });

    it('has "text/vnd.apiary.method" expected type', () => {
      assert.propertyVal(result, 'expectedType', 'text/vnd.apiary.method');
    });

    it('has no errors', () => {
      assert.lengthOf(result.errors, 0);
    });
  });

  describe('given non-matching methods', () => {
    const result = validateMethod(
      {
        method: 'POST'
      },
      {
        method: 'GET'
      }
    );

    it('returns "isValid" as "false"', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    it('has "null" validator', () => {
      assert.propertyVal(result, 'validator', null);
    });

    it('has "text/vnd.apiary.method" real type', () => {
      assert.propertyVal(result, 'realType', 'text/vnd.apiary.method');
    });

    it('has "text/vnd.apiary.method" expected type', () => {
      assert.propertyVal(result, 'expectedType', 'text/vnd.apiary.method');
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        assert.lengthOf(result.errors, 1);
      });

      it('has explanatory message', () => {
        assert.propertyVal(
          result.errors[0],
          'message',
          'Expected "method" field to equal "POST", but got "GET".'
        );
      });
    });
  });

  describe('given expected, but no real method', () => {
    const result = validateMethod(
      {
        method: 'PATCH'
      },
      {
        method: ''
      }
    );

    it('returns "isValid" as "false"', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    it('has "null" validator', () => {
      assert.propertyVal(result, 'validator', null);
    });

    it('has "text/vnd.apiary.method" real type', () => {
      assert.propertyVal(result, 'realType', 'text/vnd.apiary.method');
    });

    it('has "text/vnd.apiary.method" expected type', () => {
      assert.propertyVal(result, 'expectedType', 'text/vnd.apiary.method');
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        assert.lengthOf(result.errors, 1);
      });

      it('has explanatory message', () => {
        assert.propertyVal(
          result.errors[0],
          'message',
          'Expected "method" field to equal "PATCH", but got "".'
        );
      });
    });
  });
});
