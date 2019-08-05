const { assert } = require('chai');
const mediaTyper = require('media-typer');
const { getBodyValidator } = require('../../../../lib/units/validateBody');

const getMediaTypes = (expected, actual) => {
  return [expected, actual].map(mediaTyper.parse);
};

describe('getBodyValidator', () => {
  describe('when given known media type', () => {
    const knownContentTypes = [
      {
        contentTypes: ['application/json', 'application/json'],
        expectedValidator: 'JsonExample'
      },
      {
        contentTypes: ['application/schema+json', 'application/json'],
        expectedValidator: 'JsonSchema'
      },
      {
        contentTypes: ['text/plain', 'text/plain'],
        expectedValidator: 'TextDiff'
      }
    ];

    knownContentTypes.forEach(({ contentTypes, expectedValidator }) => {
      const [expectedContentType, actualContentType] = contentTypes;
      const [expected, actual] = getMediaTypes(
        expectedContentType,
        actualContentType
      );

      describe(`${expectedContentType} + ${actualContentType}`, () => {
        const [error, validator] = getBodyValidator(expected, actual);

        it('returns no error', () => {
          assert.isNull(error);
        });

        it(`returns "${expectedValidator}" validator`, () => {
          assert.equal(validator.name, expectedValidator);
        });
      });
    });
  });
});
