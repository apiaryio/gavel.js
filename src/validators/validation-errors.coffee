crypto = require('crypto')

# Wrapper class for errors provided by {Amanda} json schema validator
# @author Peter Grilli <tully@apiary.io>
class ValidationErrors
  # Construct a ValidationErrors
  constructor: (amandaErrors) ->
    @length = amandaErrors?.length || 0
    @amandaErrors = amandaErrors || {}
    @now = Date.now().toString()
    #TO DO need to be solved
    @dataError = null

    if @length > 0
      for i in [0..@length - 1]
        @[i] = @amandaErrors[i]

  #returns errors from given path if any or empty array
  #@param [Array] pathArray every element is key in source object
  #@return [Array] errors from given path if any or empty array
  getByPath: (pathArray) ->
    if not @hashTable then @buildHashtable()

    @hashTable[@getKeyFromPath(pathArray)] || []

  #@private
  buildHashtable: () ->
    @hashTable = {}

    if @length < 1
      return

    for i in [0..@length - 1]
      key = @getKeyFromPath(@amandaErrors[i]['property'])

      if not @hashTable[key]
        @hashTable[key] = []

      @hashTable[key].push @amandaErrors[i]

  #@private
  getKeyFromPath: (path) ->
    crypto.createHash('md5').update(path.join(@now)).digest('hex')

module.exports = {
  ValidationErrors
}
