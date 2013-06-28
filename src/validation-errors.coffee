crypto = require('crypto')

ValidationErrors = class ValidationErrors
  constructor: (amandaErrors) ->
    @length = amandaErrors?.length || 0
    @amandaErrors = amandaErrors || {}
    @now = Date.now().toString()

    for i in [0..@length - 1]
      @[i] = @amandaErrors[i]

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
