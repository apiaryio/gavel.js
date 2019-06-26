const { expect } = require('../../chai');
const { validateStatusCode } = require('../../../lib/units/validateStatusCode');

describe('validateStatusCode', () => {
  describe('given matching status codes', () => {
    const result = validateStatusCode(
      {
        statusCode: '200'
      },
      {
        statusCode: '200'
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

  describe('given non-matching status codes', () => {
    const result = validateStatusCode(
      {
        statusCode: '400'
      },
      {
        statusCode: '200'
      }
    );

    it('marks field as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('has "text" kind', () => {
      expect(result).to.have.kind('text');
    });

    describe('produces error', () => {
      it('exactly one error', () => {
        expect(result).to.have.errors.lengthOf(1);
      });

      it('has explanatory message', () => {
        expect(result)
          .to.have.errorAtIndex(0)
          .withMessage(`Status code is '200' instead of '400'`);
      });

      it('includes values', () => {
        expect(result)
          .to.have.errorAtIndex(0)
          .withValues({
            expected: '400',
            actual: '200'
          });
      });
    });
  });
});
