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
    assert.lengthOf(obj.errors, 0);
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

    it('has "isValid" set to true', () => {
      assert.propertyVal(result, 'isValid', true);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result.field, ['method', 'headers', 'body']);
    });

    describe('method', () => {
      validator(result.field.method, null);
      expectedType(result.field.method, 'text/vnd.apiary.method');
      realType(result.field.method, 'text/vnd.apiary.method');
      noErrors(result.field.method);
    });

    describe('headers', () => {
      validator(result.field.headers, 'HeadersJsonExample');
      expectedType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );
      realType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );
      noErrors(result.field.headers);
    });

    describe('body', () => {
      validator(result.field.body, 'JsonExample');
      expectedType(result.field.body, 'application/json');
      realType(result.field.body, 'application/json');
      noErrors(result.field.body);
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

    it('has "isValid" set to false', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result.field, ['method', 'headers', 'body']);
    });

    describe('method', () => {
      validator(result.field.method, null);
      expectedType(result.field.method, 'text/vnd.apiary.method');
      realType(result.field.method, 'text/vnd.apiary.method');

      describe('produces one error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.field.method.errors, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(
            result.field.method.errors[0],
            'severity',
            'error'
          );
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            result.field.method.errors[0],
            'message',
            'Expected "method" field to equal "PUT", but got "POST".'
          );
        });
      });
    });

    describe('headers', () => {
      validator(result.field.headers, 'HeadersJsonExample');
      expectedType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );
      realType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );
      noErrors(result.field.headers);
    });

    describe('body', () => {
      validator(result.field.body, 'JsonExample');
      expectedType(result.field.body, 'application/json');
      realType(result.field.body, 'application/json');

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.field.body.errors, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(result.field.body.errors[0], 'severity', 'error');
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            result.field.body.errors[0],
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

    it('sets "isValid" to true', () => {
      assert.propertyVal(result, 'isValid', true);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result.field, ['statusCode', 'headers', 'body']);
    });

    describe('statusCode', () => {
      validator(result.field.statusCode, 'TextDiff');
      expectedType(result.field.statusCode, 'text/vnd.apiary.status-code');
      realType(result.field.statusCode, 'text/vnd.apiary.status-code');
      noErrors(result.field.statusCode);
    });

    describe('headers', () => {
      validator(result.field.headers, 'HeadersJsonExample');
      expectedType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );
      realType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );
      noErrors(result.field.headers);
    });

    describe('body', () => {
      validator(result.field.body, 'JsonExample');
      expectedType(result.field.body, 'application/json');
      realType(result.field.body, 'application/json');
      noErrors(result.field.body);
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

    it('has "isValid" as false', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result.field, ['statusCode', 'headers']);
    });

    describe('statusCode', () => {
      validator(result.field.statusCode, 'TextDiff');
      expectedType(result.field.statusCode, 'text/vnd.apiary.status-code');
      realType(result.field.statusCode, 'text/vnd.apiary.status-code');

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.field.statusCode.errors, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(
            result.field.statusCode.errors[0],
            'severity',
            'error'
          );
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            result.field.statusCode.errors[0],
            'message',
            `Status code is '400' instead of '200'`
          );
        });
      });
    });

    describe('headers', () => {
      validator(result.field.headers, 'HeadersJsonExample');
      expectedType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );
      realType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.field.headers.errors, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(
            result.field.headers.errors[0],
            'severity',
            'error'
          );
        });

        it('includes missing header in the message', () => {
          assert.propertyVal(
            result.field.headers.errors[0],
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

    it('has "isValid" as false', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result.field, ['statusCode', 'headers']);
    });

    describe('statusCode', () => {
      validator(result.field.statusCode, 'TextDiff');
      expectedType(result.field.statusCode, 'text/vnd.apiary.status-code');
      realType(result.field.statusCode, 'text/vnd.apiary.status-code');
      noErrors(result.field.statusCode);
    });

    describe('headers', () => {
      validator(result.field.headers, 'HeadersJsonExample');
      expectedType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );
      realType(
        result.field.headers,
        'application/vnd.apiary.http-headers+json'
      );

      describe('produces an error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.field.headers.errors, 1);
        });

        it('has "error" severity', () => {
          assert.propertyVal(
            result.field.headers.errors[0],
            'severity',
            'error'
          );
        });

        it('has pointer to missing "Content-Type"', () => {
          assert.propertyVal(
            result.field.headers.errors[0],
            'pointer',
            '/content-type'
          );
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            result.field.headers.errors[0],
            'message',
            `At '/content-type' Missing required property: content-type`
          );
        });
      });
    });
  });

  describe('always validates expected properties', () => {
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

    it('has "isValid" as false', () => {
      assert.propertyVal(result, 'isValid', false);
    });

    it('contains all validatable keys', () => {
      assert.hasAllKeys(result.field, ['statusCode', 'headers', 'body']);
    });

    describe('for properties present in both expected and real', () => {
      describe('body', () => {
        validator(result.field.body, null);
        expectedType(result.field.body, 'application/json');
        realType(result.field.body, 'text/plain');

        describe('produces an error', () => {
          it('exactly one error', () => {
            assert.lengthOf(result.field.body.errors, 1);
          });

          it('has "error" severity', () => {
            assert.propertyVal(
              result.field.body.errors[0],
              'severity',
              'error'
            );
          });

          it('has explanatory message', () => {
            assert.propertyVal(
              result.field.body.errors[0],
              'message',
              `Can't validate real media type 'text/plain' against expected media type 'application/json'.`
            );
          });
        });
      });
    });

    describe('for properties present in expected, but not in real', () => {
      describe('statusCode', () => {
        validator(result.field.statusCode, 'TextDiff');
        expectedType(result.field.statusCode, 'text/vnd.apiary.status-code');
        realType(result.field.statusCode, 'text/vnd.apiary.status-code');

        describe('produces an error', () => {
          it('exactly one error', () => {
            assert.lengthOf(result.field.statusCode.errors, 1);
          });

          it('has "error" severity', () => {
            assert.propertyVal(
              result.field.statusCode.errors[0],
              'severity',
              'error'
            );
          });

          it('has explanatory message', () => {
            assert.propertyVal(
              result.field.statusCode.errors[0],
              'message',
              `Status code is 'undefined' instead of '200'`
            );
          });
        });
      });

      describe('headers', () => {
        validator(result.field.headers, 'HeadersJsonExample');
        expectedType(
          result.field.headers,
          'application/vnd.apiary.http-headers+json'
        );
        realType(
          result.field.headers,
          'application/vnd.apiary.http-headers+json'
        );

        describe('produces one error', () => {
          it('exactly one error', () => {
            assert.lengthOf(result.field.headers.errors, 1);
          });

          it('has "error" severity', () => {
            assert.propertyVal(
              result.field.headers.errors[0],
              'severity',
              'error'
            );
          });

          it('has explanatory message', () => {
            assert.propertyVal(
              result.field.headers.errors[0],
              'message',
              `At '/content-type' Missing required property: content-type`
            );
          });
        });
      });
    });
  });
});
