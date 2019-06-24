const { expect } = require('../chai');
const { validate } = require('../../lib/validate');

describe('validate', () => {
  describe('with matching requests', () => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: '{ "foo": "bar" }'
    };
    const result = validate(request, request);

    it('marks pair as valid', () => {
      expect(result).to.be.valid;
    });

    it('contains all validatable keys', () => {
      expect(result.fields).to.have.all.keys(['method', 'headers', 'body']);
    });

    describe('method', () => {
      expect(result.fields.method).to.be.valid;
      expect(result.fields.method).to.have.validator(null);
      expect(result.fields.method).to.have.expectedType(
        'text/vnd.apiary.method'
      );
      expect(result.fields.method).to.have.realType('text/vnd.apiary.method');
      expect(result.fields.method).to.not.have.errors;
    });

    describe('headers', () => {
      expect(result.fields.headers).to.be.valid;
      expect(result.fields.headers).to.have.validator('HeadersJsonExample');
      expect(result.fields.headers).to.have.expectedType(
        'application/vnd.apiary.http-headers+json'
      );
      expect(result.fields.headers).to.have.realType(
        'application/vnd.apiary.http-headers+json'
      );
      expect(result.fields.headers).to.not.have.errors;
    });

    describe('body', () => {
      expect(result.fields.body).to.be.valid;
      expect(result.fields.body).to.have.validator('JsonExample');
      expect(result.fields.body).to.have.expectedType('application/json');
      expect(result.fields.body).to.have.realType('application/json');
      expect(result.fields.body).to.not.have.errors;
    });
  });

  describe('with non-matching requests', () => {
    const result = validate(
      {
        method: 'PUT',
        headers: '',
        body: '2'
      },
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{ "foo": "bar" }'
      }
    );

    it('marks pairs as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('contains all validatable keys', () => {
      expect(result.fields).to.have.all.keys(['method', 'headers', 'body']);
    });

    describe('method', () => {
      expect(result.fields.method).to.not.be.valid;
      expect(result.fields.method).to.have.validator(null);
      expect(result.fields.method).to.have.expectedType(
        'text/vnd.apiary.method'
      );
      expect(result.fields.method).to.have.realType('text/vnd.apiary.method');

      describe('produces one error', () => {
        it('exactly one error', () => {
          expect(result.fields.method).to.have.errors.lengthOf(1);
        });

        it('has explanatory message', () => {
          expect(result.fields.method)
            .to.have.errorAtIndex(0)
            .withMessage(
              'Expected "method" field to equal "PUT", but got "POST".'
            );
        });
      });
    });

    describe('headers', () => {
      expect(result.fields.headers).to.be.valid;
      expect(result.fields.headers).to.have.validator('HeadersJsonExample');
      expect(result.fields.headers).to.have.expectedType(
        'application/vnd.apiary.http-headers+json'
      );
      expect(result.fields.headers).to.have.realType(
        'application/vnd.apiary.http-headers+json'
      );
      expect(result.fields.headers).to.not.have.errors;
    });

    describe('body', () => {
      expect(result.fields.body).to.not.be.valid;
      expect(result.fields.body).to.have.validator('JsonExample');
      expect(result.fields.body).to.have.expectedType('application/json');
      expect(result.fields.body).to.have.realType('application/json');

      describe('produces an error', () => {
        it('exactly one error', () => {
          expect(result.fields.body).to.have.errors.lengthOf(1);
        });

        it('has explanatory message', () => {
          expect(result.fields.body)
            .to.have.errorAtIndex(0)
            .withMessage(`At '' Invalid type: object (expected integer)`);
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
    const result = validate(response, response);

    it('marks pairs as valid', () => {
      expect(result).to.be.valid;
    });

    it('contains all validatable keys', () => {
      expect(result.fields).to.have.all.keys(['statusCode', 'headers', 'body']);
    });

    describe('statusCode', () => {
      expect(result.fields.statusCode).to.be.valid;
      expect(result.fields.statusCode).to.have.validator('TextDiff');
      expect(result.fields.statusCode).to.have.expectedType(
        'text/vnd.apiary.status-code'
      );
      expect(result.fields.statusCode).to.have.realType(
        'text/vnd.apiary.status-code'
      );
      expect(result.fields.statusCode).to.not.have.errors;
    });

    describe('headers', () => {
      expect(result.fields.headers).to.be.valid;
      expect(result.fields.headers).to.have.validator('HeadersJsonExample');
      expect(result.fields.headers).to.have.expectedType(
        'application/vnd.apiary.http-headers+json'
      );
      expect(result.fields.headers).to.have.realType(
        'application/vnd.apiary.http-headers+json'
      );
      expect(result.fields.headers).to.not.have.errors;
    });

    describe('body', () => {
      expect(result.fields.body).to.be.valid;
      expect(result.fields.body).to.have.validator('JsonExample');
      expect(result.fields.body).to.have.expectedType('application/json');
      expect(result.fields.body).to.have.realType('application/json');
      expect(result.fields.body).to.not.have.errors;
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
    const result = validate(expectedResponse, realResponse);

    it('marks pairs as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('contains all validatable keys', () => {
      expect(result.fields).to.have.all.keys(['statusCode', 'headers']);
    });

    describe('statusCode', () => {
      expect(result.fields.statusCode).to.not.be.valid;
      expect(result.fields.statusCode).to.have.validator('TextDiff');
      expect(result.fields.statusCode).to.have.expectedType(
        'text/vnd.apiary.status-code'
      );
      expect(result.fields.statusCode).to.have.realType(
        'text/vnd.apiary.status-code'
      );

      describe('produces an error', () => {
        it('exactly one error', () => {
          expect(result.fields.statusCode).to.have.errors.lengthOf(1);
        });

        it('has explanatory message', () => {
          expect(result.fields.statusCode)
            .to.have.errorAtIndex(0)
            .withMessage(`Status code is '400' instead of '200'`);
        });
      });
    });

    describe('headers', () => {
      expect(result.fields.headers).to.not.be.valid;
      expect(result.fields.headers).to.have.validator('HeadersJsonExample');
      expect(result.fields.headers).to.have.expectedType(
        'application/vnd.apiary.http-headers+json'
      );
      expect(result.fields.headers).to.have.realType(
        'application/vnd.apiary.http-headers+json'
      );

      describe('produces an error', () => {
        it('exactly one error', () => {
          expect(result.fields.headers).to.have.errors.lengthOf(1);
        });

        it('includes missing header in the message', () => {
          expect(result.fields.headers)
            .to.have.errorAtIndex(0)
            .withMessage(
              `At '/accept-language' Missing required property: accept-language`
            );
        });
      });
    });
  });

  describe('with non-matching headers', () => {
    const result = validate(
      {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      },
      {
        statusCode: 404
      }
    );

    it('marks paris as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('contains all validatable keys', () => {
      expect(result.fields).to.have.all.keys(['statusCode', 'headers']);
    });

    describe('statusCode', () => {
      expect(result.fields.statusCode).to.be.valid;
      expect(result.fields.statusCode).to.have.validator('TextDiff');
      expect(result.fields.statusCode).to.have.expectedType(
        'text/vnd.apiary.status-code'
      );
      expect(result.fields.statusCode).to.have.realType(
        'text/vnd.apiary.status-code'
      );
      expect(result.fields.statusCode).to.not.have.errors;
    });

    describe('headers', () => {
      expect(result.fields.headers).to.not.be.valid;
      expect(result.fields.headers).to.have.validator('HeadersJsonExample');
      expect(result.fields.headers).to.have.expectedType(
        'application/vnd.apiary.http-headers+json'
      );
      expect(result.fields.headers).to.have.realType(
        'application/vnd.apiary.http-headers+json'
      );

      describe('produces an error', () => {
        it('exactly one error', () => {
          expect(result.fields.headers).to.have.errors.lengthOf(1);
        });

        it('has pointer to missing "Content-Type"', () => {
          expect(result.fields.headers)
            .to.have.errorAtIndex(0)
            .withPointer('/content-type');
        });

        it('has explanatory message', () => {
          expect(result.fields.headers)
            .to.have.errorAtIndex(0)
            .withMessage(
              `At '/content-type' Missing required property: content-type`
            );
        });
      });
    });
  });

  describe('always validates expected properties', () => {
    const result = validate(
      {
        method: 'POST',
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{ "foo": "bar" }'
      },
      {
        method: 'PUT'
      }
    );

    it('marks pairs as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('contains all validatable keys', () => {
      expect(result.fields).to.have.all.keys([
        'method',
        'statusCode',
        'headers',
        'body'
      ]);
    });

    describe('for properties present in both expected and real', () => {
      describe('method', () => {
        expect(result.fields.method).to.not.be.valid;
        expect(result.fields.method).to.have.validator(null);
        expect(result.fields.method).to.have.expectedType(
          'text/vnd.apiary.method'
        );
        expect(result.fields.method).to.have.realType('text/vnd.apiary.method');

        describe('produces an error', () => {
          it('exactly one error', () => {
            expect(result.fields.method).to.have.errors.lengthOf(1);
          });

          it('has explanatory message', () => {
            expect(result.fields.method)
              .to.have.errorAtIndex(0)
              .withMessage(
                'Expected "method" field to equal "POST", but got "PUT".'
              );
          });
        });
      });
    });

    describe('for properties present in expected, but not in real', () => {
      describe('statusCode', () => {
        expect(result.fields.statusCode).to.not.be.valid;
        expect(result.fields.statusCode).to.have.validator('TextDiff');
        expect(result.fields.statusCode).to.have.expectedType(
          'text/vnd.apiary.status-code'
        );
        expect(result.fields.statusCode).to.have.realType(
          'text/vnd.apiary.status-code'
        );

        describe('produces an error', () => {
          it('exactly one error', () => {
            expect(result.fields.statusCode).to.have.errors.lengthOf(1);
          });

          it('has explanatory message', () => {
            expect(result.fields.statusCode)
              .to.have.errorAtIndex(0)
              .withMessage(`Status code is 'undefined' instead of '200'`);
          });
        });
      });

      describe('headers', () => {
        expect(result.fields.headers).to.not.be.valid;
        expect(result.fields.headers).to.have.validator('HeadersJsonExample');
        expect(result.fields.headers).to.have.expectedType(
          'application/vnd.apiary.http-headers+json'
        );
        expect(result.fields.headers).to.have.realType(
          'application/vnd.apiary.http-headers+json'
        );

        describe('produces one error', () => {
          it('exactly one error', () => {
            expect(result.fields.headers).to.have.errors.lengthOf(1);
          });

          it('has explanatory message', () => {
            expect(result.fields.headers)
              .to.have.errorAtIndex(0)
              .withMessage(
                `At '/content-type' Missing required property: content-type`
              );
          });
        });
      });

      describe('body', () => {
        expect(result.fields.body).to.not.be.valid;
        expect(result.fields.body).to.have.validator(null);
        expect(result.fields.body).to.have.expectedType('application/json');
        expect(result.fields.body).to.have.realType('text/plain');

        describe('produces an error', () => {
          it('exactly one error', () => {
            expect(result.fields.body).to.have.errors.lengthOf(1);
          });

          it('has explanatory message', () => {
            expect(result.fields.body)
              .to.have.errorAtIndex(0)
              .withMessage(
                'Expected "body" of "application/json" media type, but actual "body" is missing.'
              );
          });
        });
      });
    });
  });
});
