{HitValidator} = require('../src/hit-validator')
{Hit} = require('../src/hit')

fixtures = require '../test/fixtures'

getHit = ({reqBodyDefined, reqHeadersDefined, reqBodySchema, req_headers_schema, reqBodyReal, reqHeadersReal, resBodyDefined, resHeadersDefined, resBodyReal, resHeadersReal, resBodySchema, res_headers_schema }) ->

  hit = new Hit

  hit.request.defined.body            = reqBodyDefined
  hit.request.defined.headers         = reqHeadersDefined
  hit.request.defined.schema.body     = reqBodySchema || ''
  hit.request.defined.schema.headers  = req_headers_schema || ''
  hit.request.realPayload.body        = reqBodyReal
  hit.request.realPayload.headers     = reqHeadersReal

  hit.response.defined.body           = resBodyDefined
  hit.response.defined.headers        = resHeadersDefined
  hit.response.defined.schema.body    = resBodySchema || ''
  hit.response.defined.schema.headers = res_headers_schema || ''
  hit.response.realPayload.body       = resBodyReal
  hit.response.realPayload.headers    = resHeadersReal

  return hit

params =  {
  reqBodyDefined:     fixtures.sampleText,
  reqBodySchema:      fixtures.sampleJsonSchemaNonStrict
  reqHeadersDefined:  fixtures.sampleHeaders,
  reqBodyReal:        fixtures.sampleJsonComplexKeyAdded,
  reqHeadersReal:     fixtures.sampleHeaders,

  resBodyDefined:     fixtures.sampleText,
  resBodySchema:      fixtures.sampleJsonSchemaNonStrict
  resHeadersDefined:  fixtures.sampleHeaders,
  resBodyReal:        fixtures.sampleJsonComplexKeyMissing,
  resHeadersReal:     fixtures.sampleHeaders
}
console.error 1
hit = getHit params


console.error hit.isValid()

console.error  hit.validationResults()

