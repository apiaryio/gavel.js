{ValidationErrors} = require('./validation-errors')
errors          = require '../errors'
DiffMatchPatch = require 'googlediff'
type           = require 'is-type'

# Validates if given strings are equal
# @author Peter Grilli <tully@apiary.io>
class TextDiff
  # Construct a StringValidator and checks given data
  #@option {} [String] real data to validate
  #@option {} [String] expected json schema
  #@throw {DataNotStringError} when given real or expected is not {String}
  constructor: (@real, @expected) ->
    if not type.string(@real)
      outError = new errors.DataNotStringError 'String validator real: input data is not string'
      outError['data'] = @real
      throw outError

    if not type.string(@expected)
      outError = new errors.DataNotStringError 'String validator expected: input data is not string'
      outError['data'] = @expected
      throw outError

  #Validates if given strings are equal
  #@return [ValidationErrors]
  validate: ->

    sanitizeSurrogatePairs = (data) ->
      data.replace(/[\uD800-\uDBFF]/g, '').replace(/[\uDC00-\uDFFF]/g, '')

    @output = null
    dmp = new DiffMatchPatch

    try
      patch = dmp.patch_make @real, @expected
      @output = dmp.patch_toText patch
      return @output
    catch e
      if e instanceof URIError
        patch = dmp.patch_make sanitizeSurrogatePairs(@real), sanitizeSurrogatePairs(@expected)
        @output = dmp.patch_toText patch
        return @output
      else
        throw e

  evaluateOutputToResults: (data) ->

    if not data
      data = @output

    if not data
      return []

    return [
      severity: 'error',
      message: 'Real and expected data does not match.'
    ]

module.exports = {
  TextDiff
}
