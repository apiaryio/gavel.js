const { expect } = require('../chai');
const { validate } = require('../../lib/validate');

/**
 * This test vastly refers to https://github.com/apiaryio/dredd/issues/177
 * and asserts the validation behavior with inferred JSON schema and array
 * validation.
 */
describe('Inferred JSON Schema array validation', () => {
  describe('given expected a single array item', () => {
    const run = (actual) => {
      return validate(
        {
          headers: {
            'content-type': 'application/json'
          },
          body: '[{ "key": "value" }]'
        },
        {
          ...actual,
          headers: {
            'content-type': 'application/json'
          }
        }
      );
    };

    it('should be valid with exact array', () => {
      expect(run({ body: '[{ "key": "value" }]' })).to.be.valid;
    });

    it('should be valid for the same key with different value', () => {
      expect(run({ body: '[{ "key": 2 }]' })).to.be.valid;
    });

    it('should be valid with extra object keys', () => {
      expect(run({ body: '[{ "key": "value", "arbitrary": 1 }]' })).to.be.valid;
    });

    it('should be valid with extra array item', () => {
      expect(run({ body: '[{ "key": "value" }, 2]' })).to.be.valid;
    });

    it('should not be valid when missing required object property', () => {
      expect(run({ body: '[{ "arbitrary": 1 }]' })).not.to.be.valid;
    });

    it('should not be valid when array item is an empty object', () => {
      expect(run({ body: '[{}]' })).not.to.be.valid;
    });

    it('should not be valid with arbitrary array', () => {
      expect(run({ body: '[1, 2, 3]' })).not.to.be.valid;
    });
  });

  describe('given expected multiple array items', () => {
    const run = (actual) => {
      return validate(
        {
          headers: {
            'content-type': 'application/json'
          },
          body: '[{ "firstName": "John", "lastName": "Maverick" }]'
        },
        {
          ...actual,
          headers: {
            'content-type': 'application/json'
          }
        }
      );
    };

    it('should be valid with exact array', () => {
      expect(run({ body: '[{ "firstName": "John", "lastName": "Maverick" }]' }))
        .to.be.valid;
    });

    it('should be valid with extra object keys', () => {
      expect(
        run({
          body: '[{ "firstName": "John", "lastName": "Maverick", "extra": 2 }]'
        })
      ).to.be.valid;
    });

    it('should be valid with extra array item', () => {
      expect(
        run({
          body: '[{ "firstName": "John", "lastName": "Maverick" }, 2]'
        })
      ).to.be.valid;
    });

    it('should not be valid when either of required fields are missing', () => {
      expect(run({ body: '[{ "firstName": "John" }]' })).not.to.be.valid;
      expect(run({ body: '[{ "lastName": "Maverick" }]' })).not.to.be.valid;
    });
  });
});
