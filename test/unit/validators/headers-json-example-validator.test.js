/* eslint-disable */
const { assert } = require('chai');
const {
  HeadersJsonExample
} = require('../../../lib/validators/headers-json-example');
const fixtures = require('../../fixtures');

describe('HeadersJsonExample', () => {
  headersValidator = {};
  describe('constructor', () => {
    afterEach(() => {
      headersValidator = {};
    });

    describe('when I provede real data as non obejct', () => {
      it('should throw an exception', () => {
        const fn = () => {
          headersValidator = new HeadersJsonExample('');
        };
        assert.throw(fn, 'is not an Object');
      });
    });

    describe('when I provede expected data as non obejct', () => {
      it('should throw an exception', () => {
        const fn = () => {
          headersValidator = new HeadersJsonExample('');
        };
        assert.throw(fn, 'is not an Object');
      });
    });

    describe('when I provide correct data', () => {
      it('should not throw an exception', () => {
        const fn = () => {
          headersValidator = new HeadersJsonExample({ header1: 'value1' });
        };
        assert.doesNotThrow(fn);
      });
    });

    describe('when provided real and expected headers are the same', () => {
      before(() => {
        headersValidator = new HeadersJsonExample(fixtures.sampleHeaders);
      });

      describe('and i run validate()', () => {
        it("shouldn't return any errors", () => {
          errors = headersValidator.validate(fixtures.sampleHeaders);
          assert.equal(errors.length, 0);
        });
      });
    });

    describe('when provided real and expected headers differ in upper/lower-case state of keys', () => {
      before(() => {
        headersValidator = new HeadersJsonExample(fixtures.sampleHeaders);
      });

      describe('and I run validate()', () => {
        it("shouldn't return any errors", () => {
          errors = headersValidator.validate(fixtures.sampleHeadersMixedCase);
          assert.equal(errors.length, 0);
        });
      });
    });

    describe('when provided real and expected headers differ in one value (real change) of a key different by upper/lower', () => {
      before(() => {
        headersValidator = new HeadersJsonExample(fixtures.sampleHeaders);
      });
      describe('and I run validate()', () => {
        it('should not return error', () => {
          errors = headersValidator.validate(
            fixtures.sampleHeadersMixedCaseDiffers
          );
          assert.lengthOf(errors, 0);
        });
      });
    });

    describe('when key is missing in provided headers', () => {
      beforeEach(() => {
        headersValidator = new HeadersJsonExample(fixtures.sampleHeaders);
      });
      describe('and i run validate()', () => {
        it('should return 1 error', () => {
          errors = headersValidator.validate(fixtures.sampleHeadersMissing);
          assert.equal(errors.length, 1);
        });

        it('should have beautiful error message', () => {
          errors = headersValidator.validate(fixtures.sampleHeadersMissing);
          assert.equal(
            errors[0].message,
            `At '/header2' Missing required property: header2`
          );
        });
      });
    });

    describe('when value of content negotiation header in provided headers differs', () => {
      beforeEach(() => {
        headersValidator = new HeadersJsonExample(fixtures.sampleHeaders);
      });

      describe('and i run validate()', () => {
        it('should return 1 errors', () => {
          errors = headersValidator.validate(fixtures.sampleHeadersDiffers);
          assert.equal(errors.length, 1);
        });

        it('should have beautiful error message', () => {
          errors = headersValidator.validate(fixtures.sampleHeadersDiffers);
          assert.equal(
            errors[0].message,
            `At '/content-type' No enum match for: "application/fancy-madiatype"`
          );
        });
      });
    });
  });

  describe('when key is added to provided headers', () => {
    before(() => {
      headersValidator = new HeadersJsonExample(fixtures.sampleHeaders);
    });

    describe('and i run validate()', () => {
      it("shouldn't return any errors", () => {
        errors = headersValidator.validate(fixtures.sampleHeadersAdded);
        assert.equal(errors.length, 0);
      });
    });
  });

  describe('when real is empty object and expected is proper object', () => {
    before(() => {
      headersValidator = new HeadersJsonExample(fixtures.sampleHeaders);
    });

    describe('and i run validate()', () => {
      it('should return 2 errors', () => {
        errors = headersValidator.validate({});
        assert.equal(errors.length, 2);
      });
    });
  });

  describe('when non content negotiation header header values differs', () => {
    before(() => {
      headersValidator = new HeadersJsonExample(
        fixtures.sampleHeadersNonContentNegotiation
      );
    });

    describe('and i run validate()', () => {
      it("shouldn't return any errors", () => {
        errors = headersValidator.validate(
          fixtures.sampleHeadersWithNonContentNegotiationChanged
        );
        assert.equal(errors.length, 0);
      });
    });
  });

  describe('#validate()', () => {
    output = null;
    before(() => {
      headersValidator = new HeadersJsonExample(fixtures.sampleHeaders);
      errors = headersValidator.validate(fixtures.sampleHeadersMissing);
    });

    it('should return an obejct', () => {
      assert.isArray(errors);
    });
  });
});
