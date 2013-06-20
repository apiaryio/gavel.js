crypto = require('crypto')

module.exports.StringToJson = class StringToJson

  constructor: ( @text ) ->
    @json = {}

  generate: ->
    counter = 0
    splitted = "#{@text}".split "\n"

    if splitted.length == 1 and splitted[0] == '' then return {}

    for line in splitted
      @json["#{counter}_#{crypto.createHash('md5').update(line).digest('hex')}"] = line
      counter += 1
    @json
