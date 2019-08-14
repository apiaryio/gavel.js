const { expect } = require('../chai');
const { validateBody } = require('../../lib/units/validateBody');

describe('Regression: Unparseable JSON body', () => {
  describe('given unparseable JSON as expected body', () => {
    const result = validateBody(
      {
        headers: {
          'content-type': 'application/json'
        },
        body: `{ "username": "adm02", }`,
        bodySchema: null
      },
      {
        body: `{ "username": "adm03" }`,
        headers: {
          'content-type': 'application/json'
        }
      }
    );

    it('marks field as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('has null kind', () => {
      expect(result).to.have.kind(null);
    });

    it('has values', () => {
      expect(result).to.have.property('values');
      expect(result.values).to.deep.equal({
        expected: `{ "username": "adm02", }`,
        actual: '{ "username": "adm03" }'
      });
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        expect(result).to.have.errors.lengthOf(1);
      });

      it('has error message about unparseable actual body', () => {
        expect(result)
          .to.have.errorAtIndex(0)
          .withMessage(
            /^Can't validate: expected body 'Content-Type' header is 'application\/json' but body is not a parseable JSON:/
          );
      });
    });
  });

  describe('given unparseable JSON as actual body', () => {
    const result = validateBody(
      {
        headers: {
          'content-type': 'application/json'
        },
        body: `{ "firstName": "John" }`,
        bodySchema: null
      },
      {
        body: `{ "firstName": "Kyle", }`,
        headers: {
          'content-type': 'application/json'
        }
      }
    );

    it('marks field as invalid', () => {
      expect(result).to.not.be.valid;
    });

    it('has null kind', () => {
      expect(result).to.have.kind(null);
    });

    it('has values', () => {
      expect(result).to.have.property('values');
      expect(result.values).to.deep.equal({
        expected: `{ "firstName": "John" }`,
        actual: `{ "firstName": "Kyle", }`
      });
    });

    describe('produces an error', () => {
      it('exactly one error', () => {
        expect(result).to.have.errors.lengthOf(1);
      });

      it('has error message about unparseable actual body', () => {
        expect(result)
          .to.have.errorAtIndex(0)
          .withMessage(
            /^Can't validate: actual body 'Content-Type' header is 'application\/json' but body is not a parseable JSON:/
          );
      });
    });
  });
});
