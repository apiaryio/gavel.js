<p align="center">
  <a href="https://badge.fury.io/js/gavel" target="_blank">
    <img src="https://badge.fury.io/js/gavel.svg" alt="npm version" />
  </a>
  <a href="https://travis-ci.org/apiaryio/gavel.js" target="_blank">
    <img src="https://travis-ci.org/apiaryio/gavel.js.svg?branch=master" alt="Build Status" />
  </a>
  <a href="https://ci.appveyor.com/project/Apiary/gavel-js/branch/master" target="_blank">
    <img src="https://ci.appveyor.com/api/projects/status/0cpnaoakhs8q58tn/branch/master?svg=true" alt="Build Status" />
  </a>
  <a href="https://snyk.io/test/npm/gavel" target="_blank">
    <img src="https://snyk.io/test/npm/gavel/badge.svg" alt="Known Vulnerabilities" />
  </a>
</p>

<br />

<p align="center">
  <img src="https://raw.githubusercontent.com/apiaryio/gavel/master/img/gavel.png?v=1" alt="Gavel logo" />
</p>

<h1 align="center">Gavel</h1>

<p align="center">Gavel tells you whether an actual HTTP message is valid against an expected HTTP message.</p>

## Install

```bash
npm install gavel
```

## Usage

### CLI

```bash
# (Optional) Record HTTP messages
curl -s --trace - http://httpbin.org/ip | curl-trace-parser > expected
curl -s --trace - http://httpbin.org/ip | curl-trace-parser > actual

# Perform the validation
cat actual | gavel expected
```

> **Gavel CLI is not supported on Windows**. Example above uses [`curl-trace-parser`](https://github.com/apiaryio/curl-trace-parser).

### NodeJS

```js
const gavel = require('gavel');

// Define HTTP messages
const expected = {
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json'
  }
};

const actual = {
  statusCode: 404,
  headers: {
    'Content-Type': 'application/json'
  }
};

// Perform the validation
const result = gavel.validate(expected, actual);
```

The code above would return the following validation `result`:

```js
{
  valid: false,
  fields: {
    statusCode: {
      valid: false,
      kind: 'text',
      values: {
        expected: '200',
        actual: '404'
      },
      errors: [
        {
          message: `Expected status code '200', but got '404'.`
        }
      ]
    },
    headers: {
      valid: true,
      kind: 'json',
      values: {
        expected: {
          'Content-Type': 'application/json'
        },
        actual: {
          'Content-Type': 'application/json'
        }
      },
      errors: []
    }
  }
}
```

### Usage with JSON Schema

> When a parsable JSON body is expected without an explicit schema the [default schema](https://github.com/apiaryio/gavel-spec/blob/master/features/expectations/bodyJsonExample.feature) is inferred.

You can describe the body expectations using [JSON Schema](https://json-schema.org/) by providing a valid schema to the `bodySchema` property of the expected HTTP message:

```js
const gavel = require('gavel');

const expected = {
  bodySchema: {
    type: 'object',
    properties: {
      fruits: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  }
};

const actual = {
  body: JSON.stringify({
    fruits: ['apple', 'banana', 2]
  })
};

const result = gavel.validate(expected, actual);
```

The validation `result` against the given JSON Schema will look as follows:

```js
{
  valid: false,
  fields: {
    body: {
      valid: false,
      kind: 'json',
      values: {
        actual: "{\"fruits\":[\"apple\",\"banana\",2]}"
      },
      errors: [
        {
          message: `At '/fruits/2' Invalid type: number (expected string)`,
          location: {
            pointer: '/fruits/2'
          }
        }
      ]
    }
  }
}
```

### Supported JSON Schema versions

- [JSON Schema Draft 7](https://json-schema.org/specification-links.html#draft-7)
- [JSON Schema Draft 6](https://json-schema.org/specification-links.html#draft-6)
- [JSON Schema Draft 4](https://json-schema.org/specification-links.html#draft-4)

## Examples

Take a look at the [Gherkin](https://cucumber.io/docs/gherkin/) specification, which describes on examples how validation of each field behaves:

- [`method`](https://github.com/apiaryio/gavel-spec/blob/master/features/javascript/fields/method.feature)
- [`uri`](https://github.com/apiaryio/gavel-spec/blob/master/features/javascript/fields/uri.feature)
- [`statusCode`](https://github.com/apiaryio/gavel-spec/blob/master/features/javascript/fields/statusCode.feature)
- [`headers`](https://github.com/apiaryio/gavel-spec/blob/master/features/javascript/fields/headers.feature)
- [`body`](https://github.com/apiaryio/gavel-spec/blob/master/features/javascript/fields/body.feature)
- [`bodySchema`](https://github.com/apiaryio/gavel-spec/blob/master/features/javascript/fields/bodySchema.feature)

## Type definitions

Gavel ships with [TypeScript type definitions](./typings.d.ts). Please refer to the definitions file for more details.

## API

- `validate(expected: HttpMessage, actual: HttpMessage): ValidationResult`

## License

[MIT](LICENSE)
