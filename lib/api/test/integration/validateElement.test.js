const { assert } = require('chai');
const { validateElement } = require('../../validateElement');

describe('validateElement', () => {
  describe('with matching requests', () => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{ "foo": "bar" }'
    };
    const res = validateElement(request, request);

    it('returns validation result object', () => {
      assert.isObject(res);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(res, ['headers', 'body']);
    });

    describe('headers', () => {
      it('has "HeadersJsonExample" validator', () => {
        assert.propertyVal(res.headers, 'validator', 'HeadersJsonExample');
      });

      it('has "application/vnd.apiary.http-headers+json" real headers type', () => {
        assert.propertyVal(
          res.headers,
          'realType',
          'application/vnd.apiary.http-headers+json'
        );
      });

      it('has "application/vnd.apiary.http-headers+json" expected headers type', () => {
        assert.propertyVal(
          res.headers,
          'expectedType',
          'application/vnd.apiary.http-headers+json'
        );
      });

      it('has no errors', () => {
        assert.lengthOf(res.headers.results, 0);
      });
    });

    describe('body', () => {
      it('has "JsonExample" validator', () => {
        assert.propertyVal(res.body, 'validator', 'JsonExample');
      });

      it('has "application/json" real body type', () => {
        assert.propertyVal(res.body, 'realType', 'application/json');
      });

      it('has "application/json" expected body type', () => {
        assert.propertyVal(res.body, 'expectedType', 'application/json');
      });

      it('has no errors', () => {
        assert.lengthOf(res.body.results, 0);
      });
    });
  });

  describe('with non-matching requests', () => {
    const res = validateElement(
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: '{ "foo": "bar" }'
      },
      {
        method: 'PUT',
        headers: null,
        body: '2'
      }
    );

    it('returns validation result object', () => {
      assert.isObject(res);
    });

    it('contains all validatable keys', () => {
      // Note that "headers" are not present because
      // Gavel demands a validatable key to be present
      // in both real and expected elements.
      assert.hasAllKeys(res, ['body']);
    });

    describe('method', () => {
      it.skip('compares methods');
    });

    describe.skip('headers', () => {
      it('has no validator set', () => {
        assert.propertyVal(res.headers, 'validator', null);
      });

      it('has "application/vnd.apiary.http-headers+json" as real headers type', () => {
        assert.propertyVal(
          res.headers,
          'realType',
          'application/vnd.apiary.http-headers+json'
        );
      });

      it('has no expected headers type', () => {
        assert.propertyVal(res.headers, 'expectedType', null);
      });

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(res.headers.results, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(res.headers.results[0], 'severity', 'error');
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            res.headers.results[0],
            'message',
            `\
No validator found for real data media type
"application/vnd.apiary.http-headers+json"
and expected data media type
"null".`
          );
        });
      });
    });

    describe('body', () => {
      it('has "JsonExample" validator', () => {
        assert.propertyVal(res.body, 'validator', 'JsonExample');
      });

      it('has "application/json" real type', () => {
        assert.propertyVal(res.body, 'realType', 'application/json');
      });

      it('has "application/json" expected type', () => {
        assert.propertyVal(res.body, 'expectedType', 'application/json');
      });

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(res.body.results, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(res.body.results[0], 'severity', 'error');
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            res.body.results[0],
            'message',
            `At '' Invalid type: object (expected integer)`
          );
        });
      });
    });
  });

  describe('with matching responses', () => {
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{ "foo": "bar" }'
    };
    const result = validateElement(response, response);

    it('returns validation result object', () => {
      assert.isObject(result);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result, ['statusCode', 'headers', 'body']);
    });

    describe('statusCode', () => {
      it('has "TextDiff" validator', () => {
        assert.propertyVal(result.statusCode, 'validator', 'TextDiff');
      });

      it('has "text/vnd.apiary.status-code" real type', () => {
        assert.propertyVal(
          result.statusCode,
          'realType',
          'text/vnd.apiary.status-code'
        );
      });

      it('has "text/vnd.apiary.status-code" expected type', () => {
        assert.propertyVal(
          result.statusCode,
          'expectedType',
          'text/vnd.apiary.status-code'
        );
      });

      it('has no errors', () => {
        assert.lengthOf(result.statusCode.results, 0);
      });
    });

    describe('headers', () => {
      it('has "HeadersJsonExample" validator', () => {
        assert.propertyVal(result.headers, 'validator', 'HeadersJsonExample');
      });

      it('has "application/vnd.apiary.http-headers+json" real type', () => {
        assert.propertyVal(
          result.headers,
          'realType',
          'application/vnd.apiary.http-headers+json'
        );
      });

      it('has "application/vnd.apiary.http-headers+json" expected type', () => {
        assert.propertyVal(
          result.headers,
          'expectedType',
          'application/vnd.apiary.http-headers+json'
        );
      });

      it('has no errors', () => {
        assert.lengthOf(result.headers.results, 0);
      });
    });

    describe('body', () => {
      it('has "JsonExample" validator', () => {
        assert.propertyVal(result.body, 'validator', 'JsonExample');
      });

      it('has "application/json" real type', () => {
        assert.propertyVal(result.body, 'realType', 'application/json');
      });

      it('has "application/json" expected type', () => {
        assert.propertyVal(result.body, 'expectedType', 'application/json');
      });

      it('has no errors', () => {
        assert.lengthOf(result.body.results, 0);
      });
    });
  });

  describe('with non-matching responses', () => {
    const realResponse = {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const expectedResponse = {
      statusCode: 200,
      headers: {
        'Accept-Language': 'en-US'
      }
    };
    const result = validateElement(realResponse, expectedResponse);

    it('returns validation result object', () => {
      assert.isObject(result);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result, ['statusCode', 'headers']);
    });

    console.log(result);

    describe('statusCode', () => {
      it('has "TextDiff" validator', () => {
        assert.propertyVal(result.statusCode, 'validator', 'TextDiff');
      });

      it('has "text/vnd.apiary.status-code" real type', () => {
        assert.propertyVal(
          result.statusCode,
          'realType',
          'text/vnd.apiary.status-code'
        );
      });

      it('has "text/vnd.apiary.status-code" expected type', () => {
        assert.propertyVal(
          result.statusCode,
          'expectedType',
          'text/vnd.apiary.status-code'
        );
      });

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.statusCode.results, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(result.statusCode.results[0], 'severity', 'error');
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            result.statusCode.results[0],
            'message',
            'Real and expected data does not match.'
          );
        });
      });
    });

    describe('headers', () => {
      it('has "HeadersJsonExample" validator', () => {
        assert.propertyVal(result.headers, 'validator', 'HeadersJsonExample');
      });

      it('has "application/vnd.apiary.http-headers+json" real type', () => {
        assert.propertyVal(
          result.headers,
          'realType',
          'application/vnd.apiary.http-headers+json'
        );
      });

      it('has "application/vnd.apiary.http-headers+json" real type', () => {
        assert.propertyVal(
          result.headers,
          'realType',
          'application/vnd.apiary.http-headers+json'
        );
      });

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.headers.results, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(result.headers.results[0], 'severity', 'error');
        });

        it('includes missing header in the message', () => {
          assert.propertyVal(
            result.headers.results[0],
            'message',
            `At '/accept-language' Missing required property: accept-language`
          );
        });
      });
    });
  });
});