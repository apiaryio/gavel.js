const DiffMatchPatch = require('googlediff');
const errors = require('../../errors');

const sanitizeSurrogatePairs = (str) => {
  return str.replace(/[\uD800-\uDBFF]/g, '').replace(/[\uDC00-\uDFFF]/g, '');
};

const errorWithData = (message, data, ErrorType = Error) => {
  const error = new ErrorType(message);
  error.data = data;
  return error;
};

function textDiff(real, expected) {
  if (typeof real !== 'string') {
    throw errorWithData(
      'String validator real: input data is not string',
      real,
      errors.DataNotStringError
    );
  }

  if (typeof expected !== 'string') {
    throw errorWithData(
      'String validator expected: input data is not string',
      expected,
      errors.DataNotStringError
    );
  }

  const dmp = new DiffMatchPatch();

  try {
    return dmp.patch_toText(dmp.patch_make(real, expected));
  } catch (error) {
    if (error instanceof URIError) {
      return dmp.patch_toText(
        dmp.patch_make(
          sanitizeSurrogatePairs(real),
          sanitizeSurrogatePairs(expected)
        )
      );
    }

    throw error;
  }
}

textDiff.toResults = (output) => {
  if (!output) {
    return [];
  }

  return [
    {
      message: 'Real and expected data does not match.',
      severity: 'error'
    }
  ];
};

module.exports = { textDiff };
