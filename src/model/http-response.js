const { Validatable } = require('../mixins/validatable-http-message')
const clone = require('clone')

class HttpResponse extends Validatable {
  constructor(resources = {}) {
    super()
    HttpResponse.resourceKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false)
    })
  }
}

HttpResponse.resourceKeys = [
  'statusCode',
  'statusMessage',
  'headers',
  'body',
  'expected',
]

class ExpectedHttpResponse {
  constructor(resources = {}) {
    ExpectedHttpResponse.resourceKeys.forEach((resourceKey) => {
      this[resourceKey] = clone(resources[resourceKey], false)
    })
  }
}

ExpectedHttpResponse.resourceKeys = [
  'statusCode',
  'statusMessage',
  'headers',
  'body',
  'headersSchema',
  'bodySchema',
]

module.exports = {
  HttpResponse,
  ExpectedHttpResponse,
}
