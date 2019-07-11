/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/* eslint-disable */
const vm = require('vm');
const util = require('util');
const { assert } = require('chai');
const { exec } = require('child_process');
const gavel = require('../../../lib');

const HTTP_LINE_DELIMITER = '\n';

class World {
  constructor() {
    this.codeBuffer = '';
    this.commandBuffer = '';

    // NEW
    this.commands = [];

    this.expected = {};
    this.actual = {};

    // Parsed HTTP objects for model valdiation
    this.model = {};

    // Gavel validation result
    this.results = {};

    // CLI: Process exit status
    this.status = null;

    // Validation verdict for the whole HTTP Message
    // this.booleanResult = false;

    // Component relevant to the expectation, e.g. 'body'
    this.component = null;
    this.componentResults = null;
  }

  executeCommands(commands) {
    const commandsBuffer = commands.join(';');
    const cmd =
      `PATH=$PATH:${process.cwd()}/bin:${process.cwd()}/node_modules/.bin; cd /tmp/gavel-* ;` +
      commandsBuffer;

    return new Promise((resolve) => {
      const child = exec(cmd, function(error, stdout, stderr) {
        if (error) {
          resolve(error.code);
        }
      });

      child.on('exit', function(code) {
        resolve(code);
      });
    });
  }

  validate() {
    this.result = gavel.validate(this.expected, this.actual);
  }

  transformCodeBlock(fieldName, value) {
    switch (fieldName) {
      case 'headers':
        return this.parseHeaders(value);
      default:
        return value;
    }
  }

  parseHeaders(headersString) {
    const lines = headersString.split(HTTP_LINE_DELIMITER);

    const headers = lines.reduce((acc, line) => {
      // Using RegExp to parse a header line.
      // Splitting by semicolon (:) would split
      // Date header's time delimiter:
      // > Date: Fri, 13 Dec 3000 23:59:59 GMT
      const match = line.match(/^(\S+):\s+(.+)$/);

      assert.isNotNull(
        match,
        `\
Failed to parse a header line:
${line}

Make sure it's in the "Header-Name: value" format.
`
      );

      const [_, key, value] = match;

      return {
        ...acc,
        [key.toLowerCase()]: value.trim()
      };
    }, {});
    return headers;
  }

  parseRequestLine(parsed, firstLine) {
    const [method, uri] = firstLine.split(' ');
    parsed.method = method;
    parsed.uri = uri;
    // firstLine = firstLine.split(' ');
    // parsed.method = firstLine[0];
    // parsed.uri = firstLine[1];
  }

  parseResponseLine(parsed, firstLine) {
    const [statusCode] = firstLine.split(' ');
    parsed.statusCode = statusCode;
    // firstLine = firstLine.split(' ');
    // parsed.statusCode = firstLine[1];
    // parsed.statusMessage = firstLine[2];
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

  // Hacky coercion function to parse expcected Boolean values
  // from Gherkin feature suites.
  //
  // TODO Replace with the {boolean} placeholder from the
  // next version of Cucumber.
  toBoolean(string) {
    if (string === 'true') return true;
    if (string === 'false') return false;
    return !!string;
  }

  toCamelCase(string) {
    const result = string.replace(/\s([a-z])/g, (strings) =>
      strings[1].toUpperCase()
    );
    return result;
  }

  toPascalCase(string) {
    let result = string.replace(
      /(\w)(\w*)/g,
      (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
    );
    return (result = result.replace(' ', ''));
  }

  // Debugging helper
  inspect(data) {
    if (data !== null && typeof data === 'object') {
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
