const { expect } = require('../../chai');
const { validateHeaders } = require('../../../lib/units/validateHeaders');

describe('validateHeaders', () => {
  describe('given matching headers', () => {
    const result = validateHeaders(
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

    it('marks field as valid', () => {
      expect(result).to.be.valid;
    });

    it('has "HeadersJsonExample" validator', () => {
      expect(result).to.have.validator('HeadersJsonExample');
    });

    it('has "application/vnd.apiary.http-headers+json" real type', () => {
      expect(result).to.have.realType(
        'application/vnd.apiary.http-headers+json'
      );
    });

    it('has "application/vnd.apiary.http-headers+json" expected type', () => {
      expect(result).to.have.expectedType(
        'application/vnd.apiary.http-headers+json'
      );
    });

    it('has no errors', () => {
      expect(result).to.not.have.errors;
    });
  });

  describe('given non-matching headers', () => {
    const result = validateHeaders(
      {
        headers: {
          'accept-language': 'en-US,us',
          'content-type': 'application/json',
          connection: 'keep-alive'
        }
      },
      {
        headers: {
          connection: 'keep-alive'
        }
      }
    );

    it('marks field as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('has "HeadersJsonExample" validator', () => {
      expect(result).to.have.validator('HeadersJsonExample');
    });

    it('has "application/vnd.apiary.http-headers+json" real type', () => {
      expect(result).to.have.realType(
        'application/vnd.apiary.http-headers+json'
      );
    });

    it('has "application/vnd.apiary.http-headers+json" expected type', () => {
      expect(result).to.have.expectedType(
        'application/vnd.apiary.http-headers+json'
      );
    });

    describe('produces errors', () => {
      const missingHeaders = ['accept-language', 'content-type'];

      it('for each missing headers', () => {
        expect(result).to.have.errors.lengthOf(missingHeaders.length);
      });

      describe('for each missing header', () => {
        missingHeaders.forEach((headerName, index) => {
          describe(headerName, () => {
            it('has pointer to header name', () => {
              expect(result)
                .to.have.errorAtIndex(index)
                .withPointer(`/${headerName}`);
            });

            it('has explanatory message', () => {
              expect(result)
                .to.have.errorAtIndex(index)
                .withMessage(
                  `At '/${headerName}' Missing required property: ${headerName}`
                );
            });
          });
        });
      });
    });
  });

  describe('given non-json headers', () => {
    const result = validateHeaders(
      {
        headers: 'bar'
      },
      {
        headers: 'foo'
      }
    );

    it('marks field as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('has no validator', () => {
      expect(result).to.have.validator(null);
    });

    it('has no real type', () => {
      expect(result).to.have.realType(null);
    });

    it('has no expected type', () => {
      expect(result).to.have.expectedType(null);
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        expect(result).to.have.errors.lengthOf(1);
      });

      it('has explanatory message', () => {
        expect(result)
          .to.have.errorAtIndex(0)
          .withMessage(
            `\
No validator found for real data media type
"null"
and expected data media type
"null".\
`
          );
      });
    });
  });
});
