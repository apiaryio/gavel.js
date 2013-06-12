crypto = require('crypto')

class StringToJson

  constructor: ( @text ) ->
    @json = {}

  generate: ->
    counter = 0
    for line in "#{@text}".split "\n"
      hash = crypto.createHash('md5').update(line).digest('hex')
      @json["#{counter}_#{hash}"] = line
      counter += 1
    @json


module.exports.StringToJson = StringToJson