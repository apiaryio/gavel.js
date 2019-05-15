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
      it(`errors when given ${name}`, () => {
        assert.throw(() => validateBody({ body: value }, { body: value }));
      });
    });
  });

  describe('when given supported body type', () => {
    describe('with explicit Content-Type header', () => {
      describe('application/json', () => {
        describe('with matching body type', () => {
          const res = validateBody(
            {
              body: '{ "foo": "bar" }',
              headers: { 'content-type': 'application/json' }
            },
            { body: '{ "foo": "bar" }' }
          );

          it('has application/json real type', () => {
            assert.propertyVal(res, 'realType', 'application/json');
          });

          it('has application/json expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          it('has JsonExample validator', () => {
            assert.propertyVal(res, 'validator', 'JsonExample');
          });

          it('has no errors', () => {
            assert.lengthOf(res.results, 0);
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

          it('fallbacks to text/plain real type', () => {
            assert.propertyVal(res, 'realType', 'text/plain');
          });

          it('has application/json expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          describe('produces content-type error', () => {
            it('has proper severity', () => {
              assert.propertyVal(res.results[0], 'severity', 'error');
            });

            it('has explanatory message', () => {
              assert.match(
                res.results[0].message,
                /^Real body 'Content-Type' header is 'application\/json' but body is not a parseable JSON:/
              );
            });
          });

          it('has no validator', () => {
            assert.propertyVal(res, 'validator', null);
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

          it('has application/hal+json real type', () => {
            assert.propertyVal(res, 'realType', 'application/hal+json');
          });

          it('has application/json expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          it('has JsonExample validator', () => {
            assert.propertyVal(res, 'validator', 'JsonExample');
          });

          it('has no errors', () => {
            assert.lengthOf(res.results, 0);
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

          it('fallbacks to text/plain real type', () => {
            assert.propertyVal(res, 'realType', 'text/plain');
          });

          it('has text/plain expected type', () => {
            assert.propertyVal(res, 'expectedType', 'text/plain');
          });

          describe('produces error', () => {
            it('has "error" severity', () => {
              assert.propertyVal(res.results[0], 'severity', 'error');
            });
            it('has explanatory message', () => {
              assert.match(
                res.results[0].message,
                /^Real body 'Content-Type' header is 'application\/hal\+json' but body is not a parseable JSON:/
              );
            });
          });

          it('has no validator', () => {
            assert.propertyVal(res, 'validator', null);
          });
        });
      });
    });

    describe('without explicit Content-Type header', () => {
      describe('text/plain', () => {
        describe('with matching bodies', () => {
          const res = validateBody({ body: 'foo' }, { body: 'foo' });

          it('has text/plain real type', () => {
            assert.propertyVal(res, 'realType', 'text/plain');
          });

          it('has text/plain expected type', () => {
            assert.propertyVal(res, 'expectedType', 'text/plain');
          });

          it('has TextDiff validator', () => {
            assert.propertyVal(res, 'validator', 'TextDiff');
          });

          it('has no errors', () => {
            assert.lengthOf(res.results, 0);
          });
        });

        describe('with non-matching bodies', () => {
          const res = validateBody({ body: 'foo ' }, { body: 'bar' });

          it('has text/plain real type', () => {
            assert.propertyVal(res, 'realType', 'text/plain');
          });

          it('has text/plain expected type', () => {
            assert.propertyVal(res, 'expectedType', 'text/plain');
          });

          it('has TextDiff validator', () => {
            assert.propertyVal(res, 'validator', 'TextDiff');
          });

          describe('produces validation error', () => {
            it('exactly one error', () => {
              assert.lengthOf(res.results, 1);
            });

            it('with "error" severity', () => {
              assert.propertyVal(res.results[0], 'severity', 'error');
            });

            it('with explanatory message', () => {
              assert.hasAnyKeys(res.results[0], 'message');
              assert.propertyVal(
                res.results[0],
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

          it('has application/json real type', () => {
            assert.propertyVal(res, 'realType', 'application/json');
          });

          it('has application/json expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          it('has JsonExample validator', () => {
            assert.propertyVal(res, 'validator', 'JsonExample');
          });

          it('has no errors', () => {
            assert.lengthOf(res.results, 0);
          });
        });

        describe('with non-matching bodies', () => {
          const res = validateBody(
            { body: '{ "foo": "bar" }' },
            { body: '{ "bar": null }' }
          );

          it('has application/json real type', () => {
            assert.propertyVal(res, 'realType', 'application/json');
          });

          it('has application/json expected type', () => {
            assert.propertyVal(res, 'expectedType', 'application/json');
          });

          it('has JsonExample validator', () => {
            assert.propertyVal(res, 'validator', 'JsonExample');
          });

          describe('produces validation errors', () => {
            it('exactly one error', () => {
              assert.lengthOf(res.results, 1);
            });

            it('has "error" severity', () => {
              assert.propertyVal(res.results[0], 'severity', 'error');
            });

            it('has explanatory message', () => {
              assert.propertyVal(
                res.results[0],
                'message',
                `At '/bar' Missing required property: bar`
              );
            });
          });
        });
      });

      describe.skip('application/schema+json', () => {
        // ...
      });
    });
  });
});
