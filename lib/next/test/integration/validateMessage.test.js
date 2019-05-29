const { assert } = require('chai');
const { validateMessage } = require('../../validateMessage');

const validator = (obj, expected) => {
  it(`has "${expected}" validator`, () => {
    assert.propertyVal(obj, 'validator', expected);
  });
};

const createTypeAssertion = (typeName, propName) => (obj, expected) => {
  it(`has "${expected}" ${typeName} type`, () => {
    assert.propertyVal(obj, propName, expected);
  });
};

const realType = createTypeAssertion('real', 'realType');
const expectedType = createTypeAssertion('expected', 'expectedType');
const noErrors = (obj) => {
  it('has no errors', () => {
    assert.lengthOf(obj.results, 0);
  });
};

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
      assert.hasAllKeys(result, ['isValid', 'headers', 'body']);
    });

    it('has "isValid" set to true', () => {
      assert.propertyVal(result, 'isValid', true);
    });

    describe('headers', () => {
      validator(result.headers, 'HeadersJsonExample');
      expectedType(result.headers, 'application/vnd.apiary.http-headers+json');
      realType(result.headers, 'application/vnd.apiary.http-headers+json');
      noErrors(result.headers);
    });

    describe('body', () => {
      validator(result.body, 'JsonExample');
      expectedType(result.body, 'application/json');
      realType(result.body, 'application/json');
      noErrors(result.body);
    });
  });

  describe('with non-matching requests', () => {
    const result = validateMessage(
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{ "foo": "bar" }'
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
      assert.hasAllKeys(result, ['isValid', 'headers', 'body']);
    });

    it('has "isValid" set to false', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    describe('method', () => {
      // See https://github.com/apiaryio/gavel.js/issues/158
      it.skip('compares methods');
    });

    describe('headers', () => {
      validator(result.headers, 'HeadersJsonExample');
      expectedType(result.headers, 'application/vnd.apiary.http-headers+json');
      realType(result.headers, 'application/vnd.apiary.http-headers+json');
      noErrors(result.headers);
    });

    describe('body', () => {
      validator(result.body, 'JsonExample');
      expectedType(result.body, 'application/json');
      realType(result.body, 'application/json');

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
      assert.hasAllKeys(result, ['isValid', 'statusCode', 'headers', 'body']);
    });

    it('sets "isValid" to true', () => {
      assert.propertyVal(result, 'isValid', true);
    });

    describe('statusCode', () => {
      validator(result.statusCode, 'TextDiff');
      expectedType(result.statusCode, 'text/vnd.apiary.status-code');
      realType(result.statusCode, 'text/vnd.apiary.status-code');
      noErrors(result.statusCode);
    });

    describe('headers', () => {
      validator(result.headers, 'HeadersJsonExample');
      expectedType(result.headers, 'application/vnd.apiary.http-headers+json');
      realType(result.headers, 'application/vnd.apiary.http-headers+json');
      noErrors(result.headers);
    });

    describe('body', () => {
      validator(result.body, 'JsonExample');
      expectedType(result.body, 'application/json');
      realType(result.body, 'application/json');
      noErrors(result.body);
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
      assert.hasAllKeys(result, ['isValid', 'statusCode', 'headers']);
    });

    it('has "isValid" as false', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    describe('statusCode', () => {
      validator(result.statusCode, 'TextDiff');
      expectedType(result.statusCode, 'text/vnd.apiary.status-code');
      realType(result.statusCode, 'text/vnd.apiary.status-code');

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
            `Status code is '400' instead of '200'`
          );
        });
      });
    });

    describe('headers', () => {
      validator(result.headers, 'HeadersJsonExample');
      expectedType(result.headers, 'application/vnd.apiary.http-headers+json');
      realType(result.headers, 'application/vnd.apiary.http-headers+json');

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

  describe('with non-matching headers', () => {
    const result = validateMessage(
      {
        statusCode: 404
      },
      {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      }
    );

    it('returns validation result object', () => {
      assert.isObject(result);
    });

    it('contains all validatable keys', () => {
      assert.hasAllDeepKeys(result, ['isValid', 'statusCode', 'headers']);
    });

    it('has "isValid" as false', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    describe('statusCode', () => {
      validator(result.statusCode, 'TextDiff');
      expectedType(result.statusCode, 'text/vnd.apiary.status-code');
      realType(result.statusCode, 'text/vnd.apiary.status-code');
      noErrors(result.statusCode);
    });

    describe('headers', () => {
      validator(result.headers, 'HeadersJsonExample');
      expectedType(result.headers, 'application/vnd.apiary.http-headers+json');
      realType(result.headers, 'application/vnd.apiary.http-headers+json');

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.headers.results, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(result.headers.results[0], 'severity', 'error');
        });

        it('has pointer to missing "Content-Type"', () => {
          assert.propertyVal(
            result.headers.results[0],
            'pointer',
            '/content-type'
          );
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            result.headers.results[0],
            'message',
            `At '/content-type' Missing required property: content-type`
          );
        });
      });
    });
  });

  describe('... validates all properties in expected message', () => {
    const result = validateMessage(
      {
        body: 'doe'
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{ "foo": "bar" }'
      }
    );

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result, ['isValid', 'statusCode', 'headers', 'body']);
    });

    describe('for properties present in both expected and real', () => {
      describe('body', () => {
        validator(result.body, null);
        expectedType(result.body, 'application/json');
        realType(result.body, 'text/plain');

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
              `Can't validate real media type 'text/plain' against expected media type 'application/json'.`
            );
          });
        });
      });
    });

    describe('for properties present in expected, but not in real', () => {
      describe('statusCode', () => {
        validator(result.statusCode, 'TextDiff');
        expectedType(result.statusCode, 'text/vnd.apiary.status-code');
        realType(result.statusCode, 'text/vnd.apiary.status-code');

        describe('produces an error', () => {
          it('exactly one error', () => {
            assert.lengthOf(result.statusCode.results, 1);
          });

          it('has "error" severity', () => {
            assert.propertyVal(
              result.statusCode.results[0],
              'severity',
              'error'
            );
          });

          it('has explanatory message', () => {
            assert.propertyVal(
              result.statusCode.results[0],
              'message',
              `Status code is 'undefined' instead of '200'`
            );
          });
        });
      });

      describe('headers', () => {
        validator(result.headers, 'HeadersJsonExample');
        expectedType(
          result.headers,
          'application/vnd.apiary.http-headers+json'
        );
        realType(result.headers, 'application/vnd.apiary.http-headers+json');

        describe('produces one error', () => {
          it('exactly one error', () => {
            assert.lengthOf(result.headers.results, 1);
          });

          it('has "error" severity', () => {
            assert.propertyVal(result.headers.results[0], 'severity', 'error');
          });

          it('has explanatory message', () => {
            assert.propertyVal(
              result.headers.results[0],
              'message',
              `At '/content-type' Missing required property: content-type`
            );
          });
        });
      });
    });
  });
});
