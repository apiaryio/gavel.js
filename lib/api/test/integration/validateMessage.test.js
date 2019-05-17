const { assert } = require('chai');
const { validateMessage } = require('../../validateMessage');

describe('validateMessage', () => {
  describe('with matching requests', () => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{ "foo": "bar" }'
    };
    const result = validateMessage(request, request);

    it('returns validation result object', () => {
      assert.isObject(result);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result, ['headers', 'body']);
    });

    describe('headers', () => {
      it('has "HeadersJsonExample" validator', () => {
        assert.propertyVal(result.headers, 'validator', 'HeadersJsonExample');
      });

      it('has "application/vnd.apiary.http-headers+json" real headers type', () => {
        assert.propertyVal(
          result.headers,
          'realType',
          'application/vnd.apiary.http-headers+json'
        );
      });

      it('has "application/vnd.apiary.http-headers+json" expected headers type', () => {
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

      it('has "application/json" real body type', () => {
        assert.propertyVal(result.body, 'realType', 'application/json');
      });

      it('has "application/json" expected body type', () => {
        assert.propertyVal(result.body, 'expectedType', 'application/json');
      });

      it('has no errors', () => {
        assert.lengthOf(result.body.results, 0);
      });
    });
  });

  describe('with non-matching requests', () => {
    const result = validateMessage(
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: '{ "lookHere": "foo" }'
      },
      {
        method: 'PUT',
        headers: '',
        body: '2'
      }
    );

    it('returns validation result object', () => {
      assert.isObject(result);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result, ['headers', 'body']);
    });

    describe('method', () => {
      // See https://github.com/apiaryio/gavel.js/issues/158
      it.skip('compares methods');
    });

    describe('headers', () => {
      it('has "HeadersJsonExample" validator', () => {
        assert.propertyVal(result.headers, 'validator', 'HeadersJsonExample');
      });

      it('has "application/vnd.apiary.http-headers+json" as real type', () => {
        assert.propertyVal(
          result.headers,
          'realType',
          'application/vnd.apiary.http-headers+json'
        );
      });

      it('has "application/vnd.apiary.http-headers+json" expcted type', () => {
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

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.body.results, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(result.body.results[0], 'severity', 'error');
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            result.body.results[0],
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
    const result = validateMessage(response, response);

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
    const result = validateMessage(realResponse, expectedResponse);

    it('returns validation result object', () => {
      assert.isObject(result);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result, ['statusCode', 'headers']);
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
