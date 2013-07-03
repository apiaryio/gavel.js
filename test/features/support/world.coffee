# Function exported in this file is called before each 

module.exports = () ->
  {Hit} = require '../../../src/model/hit'
  
  myWorld = (callback) ->
    @.hit = new Hit
    
    @.codeBuffer = ""

    callback(this)

  this.World = myWorld