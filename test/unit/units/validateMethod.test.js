const { expect } = require('../../chai');
const { validateMethod } = require('../../../lib/units/validateMethod');

describe('validateMethod', () => {
  describe('given matching methods', () => {
    const result = validateMethod(
      {
        method: 'GET'
      },
      {
        method: 'GET'
      }
    );

    it('marks fields as valid', () => {
      expect(result).to.be.valid;
    });

    it('has "null" validator', () => {
      expect(result).to.have.validator(null);
    });

    it('has "text/vnd.apiary.method" real type', () => {
      expect(result).to.have.realType('text/vnd.apiary.method');
    });

    it('has "text/vnd.apiary.method" expected type', () => {
      expect(result).to.have.expectedType('text/vnd.apiary.method');
    });

    it('has no errors', () => {
      expect(result.errors).to.have.length(0);
    });
  });

  describe('given non-matching methods', () => {
    const result = validateMethod(
      {
        method: 'POST'
      },
      {
        method: 'GET'
      }
    );

    it('marks field as valid', () => {
      expect(result).to.not.be.valid;
    });

    it('has "null" validator', () => {
      expect(result).to.have.validator(null);
    });

    it('has "text/vnd.apiary.method" real type', () => {
      expect(result).to.have.realType('text/vnd.apiary.method');
    });

    it('has "text/vnd.apiary.method" expected type', () => {
      expect(result).to.have.expectedType('text/vnd.apiary.method');
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        expect(result.errors).to.have.length(1);
      });

      it('has explanatory message', () => {
        expect(result.errors[0]).to.have.property(
          'message',
          'Expected "method" field to equal "POST", but got "GET".'
        );
      });
    });
  });

  describe('given expected, but no real method', () => {
    const result = validateMethod(
      {
        method: 'PATCH'
      },
      {
        method: ''
      }
    );

    it('marks field as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('has "null" validator', () => {
      expect(result).to.have.validator(null);
    });

    it('has "text/vnd.apiary.method" real type', () => {
      expect(result).to.have.realType('text/vnd.apiary.method');
    });

    it('has "text/vnd.apiary.method" expected type', () => {
      expect(result).to.have.expectedType('text/vnd.apiary.method');
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        expect(result.errors).to.have.length(1);
      });

      it('has explanatory message', () => {
        expect(result.errors[0]).to.have.property(
          'message',
          'Expected "method" field to equal "PATCH", but got "".'
        );
      });
    });
  });
});
