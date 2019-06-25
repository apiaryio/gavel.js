const { assert, expect } = require('../../chai');
const { validateBody } = require('../../../lib/units/validateBody');

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
          headers: { 'content-type': 'text/plain' },
          body: ''
        },
        {
          headers: { 'content-type': 'application/json' },
          body: '{ "foo": "bar" }'
        }
      );

      it('marks field as invalid', () => {
        expect(result).to.not.be.valid;
      });

      it('has no validator', () => {
        expect(result).to.have.validator(null);
      });

      it('has "application/json" real type', () => {
        expect(result).to.have.realType('application/json');
      });

      it('has "text/plain" expected type', () => {
        expect(result).to.have.expectedType('text/plain');
      });

      describe('produces validation error', () => {
        it('exactly one error', () => {
          expect(result).to.have.errors.lengthOf(1);
        });

        it('has explanatory message', () => {
          expect(result)
            .to.have.errorAtIndex(0)
            .withMessage(
              `Can't validate real media type 'application/json' against expected media type 'text/plain'.`
            );
        });
      });
    });

    describe('with explicit "Content-Type" header', () => {
      describe('application/json', () => {
        describe('with matching body type', () => {
          const result = validateBody(
            {
              body: '{ "foo": "bar" }'
            },
            {
              body: '{ "foo": "bar" }',
              headers: { 'content-type': 'application/json' }
            }
          );

          it('marks field as valid', () => {
            expect(result).to.be.valid;
          });

          it('has "JsonExample" validator', () => {
            expect(result).to.have.validator('JsonExample');
          });

          it('has "application/json" real type', () => {
            expect(result).to.have.realType('application/json');
          });

          it('has "application/json" expected type', () => {
            expect(result).to.have.expectedType('application/json');
          });

          it('has no errors', () => {
            expect(result).to.not.have.errors;
          });
        });

        describe('with non-matching body type', () => {
          const result = validateBody(
            {
              body: '{ "foo": "bar" }'
            },
            {
              body: 'foo',
              headers: { 'content-type': 'application/json' }
            }
          );

          it('marks field as invalid', () => {
            expect(result).to.not.be.valid;
          });

          it('has no validator', () => {
            expect(result).to.have.validator(null);
          });

          it('fallbacks to "text/plain" real type', () => {
            expect(result).to.have.realType('text/plain');
          });

          it('has "application/json" expected type', () => {
            expect(result).to.have.expectedType('application/json');
          });

          describe('produces content-type error', () => {
            it('exactly one error', () => {
              expect(result).to.have.errors.lengthOf(1);
            });

            it('has explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(0)
                .withMessage(
                  /^Can't validate: real body 'Content-Type' header is 'application\/json' but body is not a parseable JSON:/
                );
            });
          });
        });
      });

      describe('application/hal+json', () => {
        describe('with matching body type', () => {
          const result = validateBody(
            {
              body: '{ "foo": "bar" }'
            },
            {
              body: '{ "foo": "bar" }',
              headers: {
                'content-type': 'application/hal+json'
              }
            }
          );

          it('marks field as valid', () => {
            expect(result).to.be.valid;
          });

          it('has "JsonExample" validator', () => {
            expect(result).to.have.validator('JsonExample');
          });

          it('has "application/hal+json" real type', () => {
            expect(result).to.have.realType('application/hal+json');
          });

          it('has "application/json" expected type', () => {
            expect(result).to.have.expectedType('application/json');
          });

          it('has no errors', () => {
            expect(result).to.not.have.errors;
          });
        });

        describe('with non-matching body type', () => {
          const result = validateBody(
            {
              body: 'text'
            },
            {
              body: 'text',
              headers: {
                'content-type': 'application/hal+json'
              }
            }
          );

          it('marks field as invalid', () => {
            expect(result).to.not.be.valid;
          });

          it('has no validator', () => {
            expect(result).to.have.validator(null);
          });

          it('fallbacks to "text/plain" real type', () => {
            expect(result).to.have.realType('text/plain');
          });

          it('has "text/plain" expected type', () => {
            expect(result).to.have.expectedType('text/plain');
          });

          describe('produces error', () => {
            it('exactly one error', () => {
              expect(result).to.have.errors.lengthOf(1);
            });

            it('has explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(0)
                .withMessage(
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
          const result = validateBody(
            {
              body: 'foo'
            },
            {
              body: 'foo'
            }
          );

          it('marks field as valid', () => {
            expect(result).to.be.valid;
          });

          it('has "TextDiff" validator', () => {
            expect(result).to.have.validator('TextDiff');
          });

          it('has text/plain real type', () => {
            expect(result).to.have.realType('text/plain');
          });

          it('has "text/plain" expected type', () => {
            expect(result).to.have.expectedType('text/plain');
          });

          it('has no errors', () => {
            expect(result).to.not.have.errors;
          });
        });

        describe('with non-matching bodies', () => {
          const result = validateBody(
            {
              body: 'bar'
            },
            {
              body: 'foo '
            }
          );

          it('marks field as invalid', () => {
            expect(result).to.not.be.valid;
          });

          it('has "TextDiff" validator', () => {
            expect(result).to.have.validator('TextDiff');
          });

          it('has "text/plain" real type', () => {
            expect(result).to.have.realType('text/plain');
          });

          it('has "text/plain" expected type', () => {
            expect(result).to.have.expectedType('text/plain');
          });

          describe('produces validation error', () => {
            it('exactly one error', () => {
              expect(result).to.have.errors.lengthOf(1);
            });

            it('with explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(0)
                .withMessage('Real and expected data does not match.');
            });
          });
        });
      });

      describe('application/json', () => {
        describe('with matching bodies', () => {
          const result = validateBody(
            {
              body: '{ "foo": "bar" }'
            },
            {
              body: '{ "foo": "bar" }'
            }
          );

          it('marks field as valid', () => {
            expect(result).to.be.valid;
          });

          it('has "JsonExample" validator', () => {
            expect(result).to.have.validator('JsonExample');
          });

          it('has "application/json" real type', () => {
            expect(result).to.have.realType('application/json');
          });

          it('has "application/json" expected type', () => {
            expect(result).to.have.expectedType('application/json');
          });

          it('has no errors', () => {
            expect(result).to.not.have.errors;
          });
        });

        describe('with non-matching bodies', () => {
          const result = validateBody(
            {
              body: '{ "bar": null }'
            },
            {
              body: '{ "foo": "bar" }'
            }
          );

          it('marks field as invalid', () => {
            expect(result).to.not.be.valid;
          });

          it('has "JsonExample" validator', () => {
            expect(result).to.have.validator('JsonExample');
          });

          it('has "application/json" real type', () => {
            expect(result).to.have.realType('application/json');
          });

          it('has "application/json" expected type', () => {
            expect(result).to.have.expectedType('application/json');
          });

          describe('produces validation errors', () => {
            it('exactly one error', () => {
              expect(result).to.have.errors.lengthOf(1);
            });

            it('has explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(0)
                .withMessage(`At '/bar' Missing required property: bar`);
            });
          });
        });
      });

      describe('application/schema+json', () => {
        describe('with matching bodies', () => {
          const result = validateBody(
            {
              bodySchema: {
                required: ['foo']
              }
            },
            {
              body: '{ "foo": "bar" }'
            }
          );

          it('marks field as valid', () => {
            expect(result).to.be.valid;
          });

          it('has "JsonSchema" validator', () => {
            expect(result).to.have.validator('JsonSchema');
          });

          it('has "application/json" real type', () => {
            expect(result).to.have.realType('application/json');
          });

          it('has "application/schema+json" expected type', () => {
            expect(result).to.have.expectedType('application/schema+json');
          });

          it('has no errors', () => {
            expect(result).to.not.have.errors;
          });
        });

        describe('with non-matching bodies', () => {
          const result = validateBody(
            {
              bodySchema: {
                required: ['firstName']
              }
            },
            {
              body: '{ "lastName": "Doe" }'
            }
          );

          it('marks field as invalid', () => {
            expect(result).to.not.be.valid;
          });

          it('has "JsonSchema" validator', () => {
            expect(result).to.have.validator('JsonSchema');
          });

          it('has "application/json" real type', () => {
            expect(result).to.have.realType('application/json');
          });

          it('has "application/schema+json" expected type', () => {
            expect(result).to.have.expectedType('application/schema+json');
          });

          describe('produces an error', () => {
            it('exactly one error', () => {
              expect(result).to.have.errors.lengthOf(1);
            });

            it('has explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(0)
                .withMessage(
                  `At '/firstName' Missing required property: firstName`
                );
            });
          });
        });
      });
    });
  });

  describe('given malformed JSON schema', () => {
    const getResult = () =>
      validateBody(
        {
          // Purposely invalid JSON Schema
          bodySchema: `
          {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "href"": {
                  "type": "string"
                }
              }
            }
          }
          `
        },
        {
          body: '{ "foo": "bar" }'
        }
      );

    it('must throw with malformed JSON schema error', () => {
      expect(getResult).to.throw(/^Failed to parse a given JSON Schema:/g);
    });
  });
});
