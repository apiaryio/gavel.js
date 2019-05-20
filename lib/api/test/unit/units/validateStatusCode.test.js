const { assert } = require('chai');
const { validateStatusCode } = require('../../../units/validateStatusCode');

describe('validateStatusCode', () => {
  describe('given matching status codes', () => {
    const result = validateStatusCode(
      {
        statusCode: '200'
      },
      {
        statusCode: '200'
      }
    );

    it('has "TextDiff" validator', () => {
      assert.propertyVal(result, 'validator', 'TextDiff');
    });

    it('has "text/vnd.apiary.status-code" expected type', () => {
      assert.propertyVal(result, 'expectedType', 'text/vnd.apiary.status-code');
    });

    it('has "text/vnd.apiary.status-code" real type', () => {
      assert.propertyVal(result, 'realType', 'text/vnd.apiary.status-code');
    });

    it('has no errors', () => {
      assert.deepPropertyVal(result, 'results', []);
    });
  });

  describe('given non-matching status codes', () => {
    const result = validateStatusCode(
      {
        statusCode: '200'
      },
      {
        statusCode: '400'
      }
    );

    it('has "TextDiff" validator', () => {
      assert.propertyVal(result, 'validator', 'TextDiff');
    });

    it('has "text/vnd.apiary.status-code" expected type', () => {
      assert.propertyVal(result, 'expectedType', 'text/vnd.apiary.status-code');
    });

    it('has "text/vnd.apiary.status-code" real type', () => {
      assert.propertyVal(result, 'realType', 'text/vnd.apiary.status-code');
    });

    describe('produces error', () => {
      it('exactly one error', () => {
        assert.lengthOf(result.results, 1);
      });

      it('has "error" severity', () => {
        assert.propertyVal(result.results[0], 'severity', 'error');
      });

      it('has explanatory message', () => {
        assert.propertyVal(
          result.results[0],
          'message',
          'Real and expected data does not match.'
        );
      });
    });
  });
});
