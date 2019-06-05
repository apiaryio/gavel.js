const { assert } = require('chai');
const { validateHeaders } = require('../../../units/validateHeaders');

describe('validateHeaders', () => {
  describe('given matching headers', () => {
    const res = validateHeaders(
      {
        headers: {
          'content-type': 'application/json',
          connection: 'keep-alive'
        }
      },
      {
        headers: {
          'content-type': 'application/json',
          connection: 'keep-alive'
        }
      }
    );

    it('has "HeadersJsonExample" validator', () => {
      assert.propertyVal(res, 'validator', 'HeadersJsonExample');
    });

    it('has "application/vnd.apiary.http-headers+json" real type', () => {
      assert.propertyVal(
        res,
        'realType',
        'application/vnd.apiary.http-headers+json'
      );
    });

    it('has "application/vnd.apiary.http-headers+json" expected type', () => {
      assert.propertyVal(
        res,
        'expectedType',
        'application/vnd.apiary.http-headers+json'
      );
    });

    it('has no errors', () => {
      assert.deepPropertyVal(res, 'errors', []);
    });
  });

  describe('given non-matching headers', () => {
    const res = validateHeaders(
      {
        headers: {
          connection: 'keep-alive'
        }
      },
      {
        headers: {
          'accept-language': 'en-US,us',
          'content-type': 'application/json',
          connection: 'keep-alive'
        }
      }
    );

    it('has "HeadersJsonExample" validator', () => {
      assert.propertyVal(res, 'validator', 'HeadersJsonExample');
    });

    it('has "application/vnd.apiary.http-headers+json" real type', () => {
      assert.propertyVal(
        res,
        'realType',
        'application/vnd.apiary.http-headers+json'
      );
    });

    it('has "application/vnd.apiary.http-headers+json" expected type', () => {
      assert.propertyVal(
        res,
        'expectedType',
        'application/vnd.apiary.http-headers+json'
      );
    });

    describe('produces errors', () => {
      const missingHeaders = ['accept-language', 'content-type'];

      it('for two missing headers', () => {
        assert.lengthOf(res.errors, missingHeaders.length);
      });

      describe('for each missing header', () => {
        missingHeaders.forEach((headerName, index) => {
          describe(headerName, () => {
            it('has pointer to header name', () => {
              assert.propertyVal(
                res.errors[index],
                'pointer',
                `/${headerName}`
              );
            });

            it('has explanatory message', () => {
              assert.propertyVal(
                res.errors[index],
                'message',
                `At '/${headerName}' Missing required property: ${headerName}`
              );
            });
          });
        });
      });
    });
  });

  describe('given non-json headers', () => {
    const res = validateHeaders(
      {
        headers: 'foo'
      },
      {
        headers: 'bar'
      }
    );

    it('has no validator', () => {
      assert.propertyVal(res, 'validator', null);
    });

    it('has no real type', () => {
      assert.propertyVal(res, 'realType', null);
    });

    it('has no expected type', () => {
      assert.propertyVal(res, 'expectedType', null);
    });

    describe('produces an error', () => {
      it('has one error', () => {
        assert.lengthOf(res.errors, 1);
      });

      it('has explanatory message', () => {
        assert.propertyVal(
          res.errors[0],
          'message',
          `No validator found for real data media type
"null"
and expected data media type
"null".`
        );
      });
    });
  });
});
