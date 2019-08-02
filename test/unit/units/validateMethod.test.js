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

    it('has "text" kind', () => {
      expect(result).to.have.kind('text');
    });

    it('has no errors', () => {
      expect(result).to.not.have.errors;
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

    it('has "text" kind', () => {
      expect(result).to.have.kind('text');
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        expect(result).to.have.errors.lengthOf(1);
      });

      it('has explanatory message', () => {
        expect(result)
          .to.have.errorAtIndex(0)
          .withMessage(`Expected method 'POST', but got 'GET'.`);
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

    it('has "text" kind', () => {
      expect(result).to.have.kind('text');
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        expect(result).to.have.errors.lengthOf(1);
      });

      it('has explanatory message', () => {
        expect(result)
          .to.have.errorAtIndex(0)
          .withMessage(`Expected method 'PATCH', but got ''.`);
      });
    });
  });
});
