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

    it('has "TextDiff" validator', () => {
      expect(result).to.have.validator('TextDiff');
    });

    it('has "text/vnd.apiary.status-code" expected type', () => {
      expect(result).to.have.expectedType('text/vnd.apiary.status-code');
    });

    it('has "text/vnd.apiary.status-code" real type', () => {
      expect(result).to.have.realType('text/vnd.apiary.status-code');
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

    it('has "TextDiff" validator', () => {
      expect(result).to.have.validator('TextDiff');
    });

    it('has "text/vnd.apiary.status-code" expected type', () => {
      expect(result).to.have.expectedType('text/vnd.apiary.status-code');
    });

    it('has "text/vnd.apiary.status-code" real type', () => {
      expect(result).to.have.realType('text/vnd.apiary.status-code');
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
    });
  });
});
