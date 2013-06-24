# Function exported in this file is called before each 

module.exports = () ->
  {Hit} = require '../../src/hit'
  
  myWorld = (callback) ->
    @.hit = new Hit
    
    callback(this)

  this.World = myWorld