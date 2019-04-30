/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const gavel = require('../../../lib/gavel');
const _ = require('lodash');
const vm = require('vm');
const util = require('util');
const { assert } = require('chai');

const HTTP_LINE_DELIMITER = '\n';

class World {
  constructor() {
    this.codeBuffer = '';
    this.commandBuffer = '';

    // Data for creation of:
    //
    // - ExpecterHttpResponse
    // - ExpectedHttpRequest
    // - ExpectedHttpMessage
    this.expected = {};

    // Data for creation of:
    //
    // - HttpResponse
    // - HttpRequest
    // - HttpMessage
    this.real = {};

    // Parsed HTTP objects for model valdiation
    this.model = {};

    // Results of validators
    this.results = {};

    // Validation verdict for the whole HTTP Message
    this.booleanResult = false;

    // Component relevant to the expectation, e.g. 'body'
    this.component = null;
    this.componentResults = null;

    this.expectedType = null;
    this.realType = null;
  }

  expectBlockEval(block, expectedReturn, callback) {
    const realOutput = this.safeEval(block, callback);

    // I'm terribly sorry, but curly braces not asigned to any
    // variable in evaled string are interpreted as code block
    // not an Object literal, so I'm wrapping expected code output
    // with brackets.
    // see: http://stackoverflow.com/questions/8949274/javascript-calling-eval-on-an-object-literal-with-functions

    const expectedOutput = this.safeEval(`(${expectedReturn})`, callback);

    const realOutputInspect = util.inspect(realOutput);
    const expectedOutputInspect = util.inspect(expectedOutput);

    try {
      assert.deepEqual(realOutput, expectedOutput);
    } catch (error) {
      callback(
        new Error(
          'Output of code buffer does not equal. Expected output:\n' +
            expectedOutputInspect +
            '\nbut got: \n' +
            realOutputInspect +
            '\n' +
            'Evaled code block:' +
            '\n' +
            '- - - \n' +
            block +
            '\n' +
            '- - - '
        )
      );
    }
    return callback();
  }

  safeEval(code, callback) {
    // I'm terribly sorry, it's no longer possible to manipulate module require/load
    // path inside node's process. So I'm prefixing require path by hard
    // substitution in code to pretend to 'hit' is packaged module.
    //
    // further reading on node.js load paths:
    // http://nodejs.org/docs/v0.8.23/api/all.html#all_all_together

    const formattedCode = code.replace("require('", "require('../../../lib/");

    try {
      return eval(formattedCode);
    } catch (error) {
      return callback(
        new Error(
          'Eval failed. Code buffer: \n\n' +
            formattedCode +
            '\nWith error: ' +
            error
        )
      );
    }
  }

  isValid(callback) {
    return gavel.isValid(this.real, this.expected, 'response', callback);
  }

  validate(callback) {
    return gavel.validate(this.real, this.expected, 'response', callback);
  }

  parseHeaders(headersString) {
    const lines = headersString.split(HTTP_LINE_DELIMITER);
    const headers = {};
    for (let line of Array.from(lines)) {
      const parts = line.split(':');
      const key = parts.shift();
      headers[key.toLowerCase()] = parts.join(':').trim();
    }
    return headers;
  }

  parseRequestLine(parsed, firstLine) {
    firstLine = firstLine.split(' ');
    parsed.method = firstLine[0];
    parsed.uri = firstLine[1];
  }

  parseResponseLine(parsed, firstLine) {
    firstLine = firstLine.split(' ');
    parsed.statusCode = firstLine[1];
    parsed.statusMessage = firstLine[2];
  }

  parseHttp(type, string) {
    if (type !== 'request' && type !== 'response') {
      throw Error('Type must be "request" or "response"');
    }

    const parsed = {};

    const lines = string.split(HTTP_LINE_DELIMITER);

    if (type === 'request') {
      this.parseRequestLine(parsed, lines.shift());
    }
    if (type === 'response') {
      this.parseResponseLine(parsed, lines.shift());
    }

    const bodyLines = [];
    const headersLines = [];
    let bodyEntered = false;
    for (let line of Array.from(lines)) {
      if (line === '') {
        bodyEntered = true;
      } else {
        if (bodyEntered) {
          bodyLines.push(line);
        } else {
          headersLines.push(line);
        }
      }
    }

    parsed.headers = this.parseHeaders(headersLines.join(HTTP_LINE_DELIMITER));
    parsed.body = bodyLines.join(HTTP_LINE_DELIMITER);

    return parsed;
  }

  toCamelCase(input) {
    const result = input.replace(/\s([a-z])/g, (strings) =>
      strings[1].toUpperCase()
    );
    return result;
  }

  toPascalCase(input) {
    let result = input.replace(
      /(\w)(\w*)/g,
      (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
    );
    return (result = result.replace(' ', ''));
  }

  // Debugging helper
  inspect(data) {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    } else {
      return data;
    }
  }

  // Debugging helper
  throw(data) {
    throw new Error(this.inspect(data));
  }
}

module.exports = function() {
  return (this.World = World);
};
