/* eslint-disable no-underscore-dangle */
const chai = require('chai');

const stringify = (obj) => {
  return JSON.stringify(obj, null, 2);
};

chai.use(({ Assertion }, utils) => {
  utils.addProperty(Assertion.prototype, 'valid', function() {
    const { isValid } = this._obj;
    const stringifiedObj = stringify(this._obj);

    this.assert(
      isValid === true,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have "isValid" equal #{exp}, but got #{act}'.
`,
      `
Expected the following HTTP message field:

${stringifiedObj}

to be invalid, but it is actually valid.`
    );
  });

  Assertion.addMethod('validator', function(expectedValue) {
    const { validator: actualValue } = this._obj;
    const stringifiedObj = stringify(this._obj);

    this.assert(
      actualValue === expectedValue,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have "${expectedValue}" validator, but got "${actualValue}".
      `,
      `
Expected the following HTTP message field:

${stringifiedObj}

to not have validator equal to "${expectedValue}".
`,
      expectedValue,
      actualValue
    );
  });

  Assertion.addMethod('expectedType', function(expectedValue) {
    const { expectedType: actualValue } = this._obj;
    const stringifiedObj = stringify(this._obj);

    this.assert(
      actualValue === expectedValue,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have an "expectedType" equal to "${expectedValue}", but got "${actualValue}".
  `,
      `
Expected the following HTTP message field:

${stringifiedObj}

to not have an "expectedType" of "${expectedValue}".
      `,
      expectedValue,
      actualValue
    );
  });

  Assertion.addMethod('realType', function(expectedValue) {
    const { realType: actualValue } = this._obj;
    const stringifiedObj = stringify(this._obj);

    this.assert(
      actualValue === expectedValue,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have an "realType" equal to "${expectedValue}", but got "${actualValue}".
`,
      `
Expected the following HTTP message field:

${stringifiedObj}

to not have an "realType" of "${expectedValue}".
      `,
      expectedValue,
      actualValue
    );
  });
});

module.exports = chai;
