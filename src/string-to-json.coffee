crypto = require('crypto')

module.exports.StringToJson = class StringToJson

  constructor: ( @text ) ->
    @json = {}

  generate: ->
    counter = 0
    for line in "#{@text}".split "\n"
      @json["#{counter}_#{crypto.createHash('md5').update(line).digest('hex')}"] = line
      counter += 1
    @json
