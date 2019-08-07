/* eslint-disable no-new */
const { expect } = require('chai');
const { TextDiff } = require('../../../lib/validators/text-diff');

describe('TextDiff', () => {
  describe('when expected non-string data', () => {
    it('should throw an exception', () => {
      const fn = () => {
        new TextDiff(null, '');
      };
      expect(fn).to.throw();
    });
  });

  describe('when given non-string actual data', () => {
    it('should throw an exception', () => {
      const fn = () => {
        new TextDiff('', null);
      };
      expect(fn).to.throw();
    });
  });

  describe('when expected internationalized string', () => {
    const expected = 'Iñtërnâtiônàlizætiøn☃';

    it('should resolve on matching actual string', () => {
      const validator = new TextDiff(expected, expected);
      expect(validator.validate()).to.be.true;
    });

    it('should reject on non-matching actual string', () => {
      const validator = new TextDiff(expected, 'Nâtiônàl');
      expect(validator.validate()).to.be.false;
    });
  });

  describe('when expected textual data', () => {
    const expected = 'john';

    it('should resolve when given matching actual data', () => {
      const validator = new TextDiff(expected, 'john');
      expect(validator.validate()).to.be.true;
    });

    it('should reject when given non-matching actual data', () => {
      const validator = new TextDiff(expected, 'barry');
      expect(validator.validate()).to.be.false;
    });
  });

  describe('when evaluating output to results', () => {
    describe('when expected and actual data match', () => {
      const validator = new TextDiff('john', 'john');
      validator.validate();
      const result = validator.evaluateOutputToResults();

      it('should return an empty array', () => {
        expect(result).to.be.instanceOf(Array);
        expect(result).to.have.lengthOf(0);
      });
    });

    describe('when expected and actual data do not match', () => {
      const validator = new TextDiff('john', 'barry');
      validator.validate();
      const result = validator.evaluateOutputToResults();

      it('should return an array', () => {
        expect(result).to.be.instanceOf(Array);
      });

      it('should contain exactly one error', () => {
        expect(result).to.have.lengthOf(1);
      });

      it('error should include the "message"', () => {
        expect(result[0]).to.have.property(
          'message',
          'Actual and expected data do not match.'
        );
      });
    });
  });
});
