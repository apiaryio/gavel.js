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

      it('has "null" kind', () => {
        expect(result).to.have.kind(null);
      });

      describe('produces validation error', () => {
        it('exactly one error', () => {
          expect(result).to.have.errors.lengthOf(1);
        });

        it('has explanatory message', () => {
          expect(result)
            .to.have.errorAtIndex(0)
            .withMessage(
              `Can't validate actual media type 'application/json' against the expected media type 'text/plain'.`
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

          it('has "json" kind', () => {
            expect(result).to.have.kind('json');
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

          it('has "null" kind', () => {
            expect(result).to.have.kind(null);
          });

          describe('produces content-type error', () => {
            it('exactly one error', () => {
              expect(result).to.have.errors.lengthOf(1);
            });

            it('has explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(0)
                .withMessage(
                  /^Can't validate: actual body 'Content-Type' header is 'application\/json' but body is not a parseable JSON:/
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

          it('has "json" kind', () => {
            expect(result).to.have.kind('json');
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

          it('has "null" kind', () => {
            expect(result).to.have.kind(null);
          });

          describe('produces error', () => {
            it('exactly one error', () => {
              expect(result).to.have.errors.lengthOf(1);
            });

            it('has explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(0)
                .withMessage(
                  /^Can't validate: actual body 'Content-Type' header is 'application\/hal\+json' but body is not a parseable JSON:/
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

          it('has "text" kind', () => {
            expect(result).to.have.kind('text');
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

          it('has "text" kind', () => {
            expect(result).to.have.kind('text');
          });

          describe('produces validation error', () => {
            it('exactly one error', () => {
              expect(result).to.have.errors.lengthOf(1);
            });

            it('with explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(0)
                .withMessage('Actual and expected data do not match.');
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

          it('has "json" kind', () => {
            expect(result).to.have.kind('json');
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

          it('has "json" kind', () => {
            expect(result).to.have.kind('json');
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

          it('has "json" kind', () => {
            expect(result).to.have.kind('json');
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

          it('has "json" kind', () => {
            expect(result).to.have.kind('json');
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

        describe('with non-matching body types', () => {
          const result = validateBody(
            {
              bodySchema: {
                properties: {
                  firstName: {
                    type: 'string'
                  }
                }
              }
            },
            {
              body: '{ "firstName": null }'
            }
          );

          it('marks field as invalid', () => {
            expect(result).to.not.be.valid;
          });

          it('has "json" kind', () => {
            expect(result).to.have.kind('json');
          });

          describe('produces an error', () => {
            it('exactly one error', () => {
              expect(result).to.have.errors.lengthOf(1);
            });

            it('has explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(0)
                .withMessage(
                  `At '/firstName' Invalid type: null (expected string)`
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
      expect(getResult).to.throw(
        /^Failed to validate HTTP message "body": given JSON Schema is not a valid JSON/g
      );
    });
  });
});
