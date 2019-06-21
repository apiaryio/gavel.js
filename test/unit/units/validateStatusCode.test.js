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
      expect(result.errors).to.have.length(0);
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
        expect(result.errors).to.have.length(1);
      });

      it('has explanatory message', () => {
        expect(result.errors[0]).to.have.property(
          'message',
          `Status code is '200' instead of '400'`
        );
      });
    });
  });
});
