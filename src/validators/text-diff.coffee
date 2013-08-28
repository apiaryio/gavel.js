{ValidationErrors} = require('./validation-errors')
errors          = require '../errors'
DiffMatchPatch = require 'googlediff'

# Validates if given strings are equal
# @author Peter Grilli <tully@apiary.io>
class TextDiff
  # Construct a StringValidator and checks given data
  #@option {} [String] real data to validate
  #@option {} [String] expected json schema
  #@throw {DataNotStringError} when given real or expected is not {String}
  constructor: (@real, @expected) ->
    if typeof(@real) != 'string'
      outError = new errors.DataNotStringError 'String validator real: input data is not string'
      outError['data'] = @real
      throw outError

    if typeof(@expected) != 'string'
      outError = new errors.DataNotStringError 'String validator expected: input data is not string'
      outError['data'] = @expected
      throw outError

  #Validates if given strings are equal
  #@return [ValidationErrors]
  validate: ->
    @output = null
    dmp = new DiffMatchPatch
    patch = dmp.patch_make @real, @expected
    @output = dmp.patch_toText patch
  
  @evaluateOutputToResults: (data) -> 
    results = []
    if data == null
      return results     
    
    if data == ''
      return []
    
    else
      message = {
        severity: 'error',
        message: 'Real and expected data does not match.'
      }
      results.push message
    results
  #@private
  getHash: (data) ->
    crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')

module.exports = {
  TextDiff
}