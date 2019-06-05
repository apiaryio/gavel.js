const { assert } = require('chai');
const { validateBody } = require('../../../units/validateBody');

describe('validateBody', () => {
  describe('when given unsupported body type', () => {
    const scenarios = [
      { name: 'number', value: 5 },
      { name: 'array', value: ['foo', 'bar'] },
      { name: 'object', value: { foo: 'bar' } },
      { name: 'null', value: null },
      { name: 'undefined', value: undefined }
    ];

    scenarios.forEach(({ name, value }) => {
      it(`throws when given ${name}`, () => {
        assert.throw(() => validateBody({ body: value }, { body: value }));
      });
    });
  });

  describe('when given supported body type', () => {
    describe('in a combination without related validator', () => {
      const result = validateBody(
        {
          headers: { 'content-type': 'application/json' },
          body: '{ "foo": "bar" }'
        },
        {
          headers: { 'content-type': 'text/plain' },
          body: ''
        }
      );

      it('has no validator', () => {
        assert.isNull(result.validator);
      });

      it('has "application/json" real type', () => {
        assert.propertyVal(result, 'realType', 'application/json');
      });

      it('has "text/plain" expected type', () => {
        assert.propertyVal(result, 'expectedType', 'text/plain');
      });

      describe('produces validation error', () => {
        it('exactly one error', () => {
          assert.lengthOf(result.errors, 1);
        });

        it('has explanatory message', () => {
          assert.propertyVal(
            result.errors[0],
            'message',
            `Can't validate real media type 'application/json' against expected media type 'text/plain'.`
          );
        });
      });
    });

    describe('with explicit "Content-Type" header', () => {
      describe('application/json', () => {
        describe('with matching body type', () => {
          const res = validateBody(
            {
              body: '{ "foo": "bar" }',
              headers: { 'content-type': 'application/json' }
            },
            {
              body: '{ "foo": "bar" }'
            }
          );

          it('has "JsonExample" validator', () => {
            assert.propertyVal(res, 'validator', 'JsonExample');
          });

          it('has "application/json" real type', () => {
            assert.propertyVal(res, 'realType', 'application/json');
          });

          it('has "application/json" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          it('has no errors', () => {
            assert.lengthOf(res.errors, 0);
          });
        });

        describe('with non-matching body type', () => {
          const res = validateBody(
            {
              body: 'foo',
              headers: { 'content-type': 'application/json' }
            },
            { body: '{ "foo": "bar" }' }
          );

          it('has no validator', () => {
            assert.propertyVal(res, 'validator', null);
          });

          it('fallbacks to "text/plain" real type', () => {
            assert.propertyVal(res, 'realType', 'text/plain');
          });

          it('has "application/json" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          describe('produces content-type error', () => {
            it('has explanatory message', () => {
              assert.match(
                res.errors[0].message,
                /^Can't validate: real body 'Content-Type' header is 'application\/json' but body is not a parseable JSON:/
              );
            });
          });
        });
      });

      describe('application/hal+json', () => {
        describe('with matching body type', () => {
          const res = validateBody(
            {
              body: '{ "foo": "bar" }',
              headers: {
                'content-type': 'application/hal+json'
              }
            },
            {
              body: '{ "foo": "bar" }'
            }
          );

          it('has "JsonExample" validator', () => {
            assert.propertyVal(res, 'validator', 'JsonExample');
          });

          it('has "application/hal+json" real type', () => {
            assert.propertyVal(res, 'realType', 'application/hal+json');
          });

          it('has "application/json" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          it('has no errors', () => {
            assert.lengthOf(res.errors, 0);
          });
        });

        describe('with non-matching body type', () => {
          const res = validateBody(
            {
              body: 'text',
              headers: {
                'content-type': 'application/hal+json'
              }
            },
            {
              body: 'text'
            }
          );

          it('has no validator', () => {
            assert.propertyVal(res, 'validator', null);
          });

          it('fallbacks to "text/plain" real type', () => {
            assert.propertyVal(res, 'realType', 'text/plain');
          });

          it('has "text/plain" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'text/plain');
          });

          describe('produces error', () => {
            it('has explanatory message', () => {
              assert.match(
                res.errors[0].message,
                /^Can't validate: real body 'Content-Type' header is 'application\/hal\+json' but body is not a parseable JSON:/
              );
            });
          });
        });
      });
    });

    describe('without explicit "Content-Type" header', () => {
      describe('text/plain', () => {
        describe('with matching bodies', () => {
          const res = validateBody({ body: 'foo' }, { body: 'foo' });

          it('has "TextDiff" validator', () => {
            assert.propertyVal(res, 'validator', 'TextDiff');
          });

          it('has text/plain real type', () => {
            assert.propertyVal(res, 'realType', 'text/plain');
          });

          it('has "text/plain" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'text/plain');
          });

          it('has no errors', () => {
            assert.lengthOf(res.errors, 0);
          });
        });

        describe('with non-matching bodies', () => {
          const res = validateBody({ body: 'foo ' }, { body: 'bar' });

          it('has "TextDiff" validator', () => {
            assert.propertyVal(res, 'validator', 'TextDiff');
          });

          it('has "text/plain" real type', () => {
            assert.propertyVal(res, 'realType', 'text/plain');
          });

          it('has "text/plain" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'text/plain');
          });

          describe('produces validation error', () => {
            it('exactly one error', () => {
              assert.lengthOf(res.errors, 1);
            });

            it('with explanatory message', () => {
              assert.hasAnyKeys(res.errors[0], 'message');
              assert.propertyVal(
                res.errors[0],
                'message',
                'Real and expected data does not match.'
              );
            });
          });
        });
      });

      describe('application/json', () => {
        describe('with matching bodies', () => {
          const res = validateBody(
            { body: '{ "foo": "bar" }' },
            { body: '{ "foo": "bar" }' }
          );

          it('has "JsonExample" validator', () => {
            assert.propertyVal(res, 'validator', 'JsonExample');
          });

          it('has "application/json" real type', () => {
            assert.propertyVal(res, 'realType', 'application/json');
          });

          it('has "application/json" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          it('has no errors', () => {
            assert.lengthOf(res.errors, 0);
          });
        });

        describe('with non-matching bodies', () => {
          const res = validateBody(
            { body: '{ "foo": "bar" }' },
            { body: '{ "bar": null }' }
          );

          it('has "JsonExample" validator', () => {
            assert.propertyVal(res, 'validator', 'JsonExample');
          });

          it('has "application/json" real type', () => {
            assert.propertyVal(res, 'realType', 'application/json');
          });

          it('has "application/json" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          describe('produces validation errors', () => {
            it('exactly one error', () => {
              assert.lengthOf(res.errors, 1);
            });

            it('has explanatory message', () => {
              assert.propertyVal(
                res.errors[0],
                'message',
                `At '/bar' Missing required property: bar`
              );
            });
          });
        });
      });

      describe('application/schema+json', () => {
        describe('with matching bodies', () => {
          const res = validateBody(
            { body: '{ "foo": "bar" }' },
            {
              bodySchema: {
                required: ['foo']
              }
            }
          );

          it('has "JsonSchema" validator', () => {
            assert.propertyVal(res, 'validator', 'JsonSchema');
          });

          it('has "application/json" real type', () => {
            assert.propertyVal(res, 'realType', 'application/json');
          });

          it('has "application/schema+json" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/schema+json');
          });

          it('has no errors', () => {
            assert.lengthOf(res.errors, 0);
          });
        });

        describe('with non-matching bodies', () => {
          const res = validateBody(
            { body: '{ "oneTwoThree": "bar" }' },
            {
              bodySchema: {
                required: ['doe']
              }
            }
          );

          it('has "JsonSchema" validator', () => {
            assert.propertyVal(res, 'validator', 'JsonSchema');
          });

          it('has "application/json" real type', () => {
            assert.propertyVal(res, 'realType', 'application/json');
          });

          it('has "application/schema+json" expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/schema+json');
          });

          describe('produces an error', () => {
            it('exactly one error', () => {
              assert.lengthOf(res.errors, 1);
            });

            it('has explanatory message', () => {
              assert.propertyVal(
                res.errors[0],
                'message',
                `At '/doe' Missing required property: doe`
              );
            });
          });
        });
      });
    });
  });
});
