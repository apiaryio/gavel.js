const { assert } = require('chai');
const validateStatusCode = require('../../units/validateStatusCode');

describe('validateStatusCode', () => {
  describe('given matching status codes', () => {
    const res = validateStatusCode(
      {
        statusCode: 200
      },
      {
        statusCode: 200
      }
    );

    it('has proper validator', () => {
      assert.propertyVal(res, 'validator', 'TextDiff');
    });

    it('has proper expected type', () => {
      assert.propertyVal(res, 'expectedType', 'text/vnd.apiary.status-code');
    });

    it('has proper real type', () => {
      assert.propertyVal(res, 'realType', 'text/vnd.apiary.status-code');
    });

    it('has no errors', () => {
      assert.deepPropertyVal(res, 'results', []);
    });
  });

  describe('given non-matching status codes', () => {
    const res = validateStatusCode(
      {
        statusCode: 200
      },
      {
        statusCode: 400
      }
    );

    it('has proper validator', () => {
      assert.propertyVal(res, 'validator', 'TextDiff');
    });

    it('has proper expected type', () => {
      assert.propertyVal(res, 'expectedType', 'text/vnd.apiary.status-code');
    });

    it('has proper real type', () => {
      assert.propertyVal(res, 'realType', 'text/vnd.apiary.status-code');
    });

    it('has errors', () => {
      assert.deepPropertyVal(res, 'results', [
        {
          message: 'Real and expected data does not match.',
          severity: 'error'
        }
      ]);
    });
  });
});
