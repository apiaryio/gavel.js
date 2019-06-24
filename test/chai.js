/* eslint-disable no-underscore-dangle */
const chai = require('chai');

const stringify = (obj) => {
  return JSON.stringify(obj, null, 2);
};

chai.use(({ Assertion }, utils) => {
  const createErrorPropertyAssertion = (propName, methodName) => {
    Assertion.addMethod(methodName, function(expectedValue) {
      const stringifiedObj = stringify(this._obj);
      const { currentError: error, currentErrorIndex } = this.__flags;
      const target = error[propName];
      const isRegExp = expectedValue instanceof RegExp;
      const matchWord = isRegExp ? 'matches' : 'equals';

      new Assertion(error).to.be.instanceOf(Object);
      new Assertion(error).to.have.property(propName);

      this.assert(
        isRegExp ? expectedValue.test(target) : target === expectedValue,
        `
  Expected the next HTTP message field:
  
  ${stringifiedObj}
  
  to have ${propName} at index ${currentErrorIndex} that ${matchWord}:
  
  ${expectedValue.toString()}
  
  but got:
  
  ${target.toString()}
  `,
        `
  Expected the next HTTP message field:
  
  ${stringifiedObj}
  
  not to have ${propName} at index ${currentErrorIndex}, but got:
  
  ${target.toString()}
  `,
        expectedValue.toString(),
        target.toString(),
        true
      );
    });
  };

  createErrorPropertyAssertion('message', 'withMessage');
  createErrorPropertyAssertion('pointer', 'withPointer');

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

to be invalid, but it is actually valid.`,
      { isValid },
      { isValid: true },
      true
    );
  });

  utils.addProperty(Assertion.prototype, 'errors', function() {
    const { errors } = this._obj;
    const stringifiedObj = stringify(this._obj);

    this.assert(
      errors.length > 0,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have some errors, but got no errors.
`,
      `
Expected the following HTTP message field:

${stringifiedObj}

to have no errors, but got ${errors.length} error(s).
      `,
      { errors: [] },
      { errors },
      true
    );

    utils.flag(this, 'object', errors);
  });

  Assertion.addMethod('errorAtIndex', function(index) {
    const { errors } = this._obj;
    const errorsCount = errors.length;

    new Assertion(errors).to.be.instanceOf(Array);
    new Assertion(errorsCount).to.be.a('number');

    this.assert(
      errors[index],
      `Expected to have error at index ${index}`,
      `Expected NOT to have error at index ${index}`
    );

    utils.flag(this, 'currentError', errors[index]);
    utils.flag(this, 'currentErrorIndex', index);
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
      actualValue,
      true
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
      actualValue,
      true
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
      actualValue,
      true
    );
  });
});

module.exports = chai;
