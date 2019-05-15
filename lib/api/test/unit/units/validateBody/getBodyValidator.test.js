const { assert } = require('chai');
const mediaTyper = require('media-typer');
const { getBodyValidator } = require('../../../../units/validateBody');

const getMediaTypes = (real, expected) => {
  return [real, expected].map(mediaTyper.parse);
};

describe('getBodyValidator', () => {
  const knownContentTypes = [
    {
      contentTypes: ['application/json', 'application/json'],
      expectedValidator: 'JsonExample'
    },
    {
      contentTypes: ['application/json', 'application/schema+json'],
      expectedValidator: 'JsonSchema'
    },
    {
      contentTypes: ['text/plain', 'text/plain'],
      expectedValidator: 'TextDiff'
    }
  ];

  const unknownContentTypes = [
    {
      contentTypes: ['application/xml', 'application/xml']
    },
    {
      contentTypes: ['text/html', 'application/xml']
    }
  ];

  describe('when given known media type', () => {
    knownContentTypes.forEach(({ contentTypes, expectedValidator }) => {
      const [realContentType, expectedContentType] = contentTypes;
      const [real, expected] = getMediaTypes(
        realContentType,
        expectedContentType
      );

      describe(`${realContentType} + ${expectedContentType}`, () => {
        const [error, validator] = getBodyValidator(real, expected);

        it('returns no error', () => {
          assert.isNull(error);
        });

        it(`returns "${expectedValidator}" validator`, () => {
          assert.equal(validator.name, expectedValidator);
        });
      });
    });
  });

  describe('when given unknown media type', () => {
    unknownContentTypes.forEach(({ contentTypes }) => {
      const [realContentType, expectedContentType] = contentTypes;
      const [real, expected] = getMediaTypes(
        realContentType,
        expectedContentType
      );

      describe(`${realContentType} + ${expectedContentType}`, () => {
        const [error, validator] = getBodyValidator(real, expected);

        it('has explanatory error', () => {
          assert.equal(
            error,
            `Can't validate real media type '${realContentType}' against expected media type '${expectedContentType}'.`
          );
        });

        it('returns null validator', () => {
          assert.isNull(validator);
        });
      });
    });
  });
});
