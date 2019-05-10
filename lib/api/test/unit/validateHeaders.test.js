const { assert } = require('chai');
const validateHeaders = require('../../units/validateHeaders');

describe('validateHeaders', () => {
  describe('given matching headers', () => {
    const res = validateHeaders(
      {
        'content-type': 'application/json',
        connection: 'keep-alive'
      },
      {
        'content-type': 'application/json',
        connection: 'keep-alive'
      }
    );

    it('has proper validator', () => {
      assert.propertyVal(res, 'validator', 'HeadersJsonExample');
    });

    it('has proper real type', () => {
      assert.propertyVal(
        res,
        'realType',
        'application/vnd.apiary.http-headers+json'
      );
    });

    it('has proper expected type', () => {
      assert.propertyVal(
        res,
        'expectedType',
        'application/vnd.apiary.http-headers+json'
      );
    });

    it('has no errors', () => {
      assert.deepPropertyVal(res, 'results', []);
    });
  });

  describe('given non-matching headers', () => {
    const res = validateHeaders(
      {
        connection: 'keep-alive'
      },
      {
        'content-type': 'application/json',
        connection: 'keep-alive'
      }
    );

    it('has proper validator', () => {
      assert.propertyVal(res, 'validator', 'HeadersJsonExample');
    });

    it('has proper real type', () => {
      assert.propertyVal(
        res,
        'realType',
        'application/vnd.apiary.http-headers+json'
      );
    });

    it('has proper expected type', () => {
      assert.propertyVal(
        res,
        'expectedType',
        'application/vnd.apiary.http-headers+json'
      );
    });

    describe('has error', () => {
      it('for each missing header', () => {
        assert.lengthOf(res.results, 1);
      });

      it('contains pointer to missing header(s)', () => {
        assert.propertyVal(res.results[0], 'pointer', '/content-type');
      });

      it('contains error message', () => {
        assert.propertyVal(
          res.results[0],
          'message',
          `At '/content-type' Missing required property: content-type`
        );
      });

      it('contains proper severity', () => {
        assert.propertyVal(res.results[0], 'severity', 'error');
      });
    });
  });

  describe('given non-json headers', () => {
    const res = validateHeaders('foo', 'bar');

    it('has no validator', () => {
      assert.propertyVal(res, 'validator', null);
    });

    it('has no real type', () => {
      assert.propertyVal(res, 'realType', null);
    });

    it('has no expected type', () => {
      assert.propertyVal(res, 'expectedType', null);
    });

    it('has invalid format error', () => {
      assert.lengthOf(res.results, 1);
      assert.propertyVal(res.results[0], 'severity', 'error');
      assert.propertyVal(
        res.results[0],
        'message',
        `No validator found for real data media type
"null"
and expected data media type
"null".`
      );
    });
  });
});
