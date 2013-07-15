gavel = require('../../../src/index')

# Function exported in this file is called before each 
module.exports = () ->
  
  myWorld = (callback) ->
    
    @codeBuffer = ""
    
    # expected will contains data for creation of objects:
    # ExpecterHttpResponse, ExpectedHttpRequest or ExpectedHttpMessage
    @expected = {}

    # real will contains data for creation of objects:
    # HttpResponse, HttpRequest or HttpMessage   
    @real = {}
    
    # contains parsed http objects for model valdiation
    @model = {}
    

    @validate = (cb) ->

      @real.expected = new gavel.ExpectedHttpResponse @expected
      http = new gavel.HttpResponse @real
      
      gavel.validate http, (error,result) ->
        cb error, result 

    
    # stupid HTTP parser for strings
    HTTP_LINE_DELIMITER = "\n"
    
    @parseHeaders = (headersString) ->
      lines = headersString.split(HTTP_LINE_DELIMITER)
      headers = {}
      for line in lines
        parts = line.split(":")
        key = parts.shift()
        headers[key.toLowerCase()] = parts.join(":").trim()
      headers

    @parseRequestLine = (parsed, firstLine) ->
      firstLine = firstLine.split(' ')
      parsed.method = firstLine[0]
      parsed.uri = firstLine[1]
      #parsed.protocol = firstLine[2]

    @parseResponseLine = (parsed, firstLine) ->
      firstLine = firstLine.split(' ')
      #parsed.protocol = firstLine[0]
      parsed.statusCode = firstLine[1]
      parsed.statusMessage = firstLine[2]



    @parseHttp = (type, string) ->   
      throw Error 'Type must be "request" or "response"' unless type == 'request' or type == 'response' 
      
      parsed = {}
       
      lines = string.split HTTP_LINE_DELIMITER

      if type == 'request'
        @parseRequestLine parsed, lines.shift() 
      if type == 'response'
        @parseResponseLine parsed, lines.shift() 
      
      bodyLines = []
      headersLines = []
      bodyEntered = false      
      for line in lines

        if line == ''
          bodyEntered = true      
        else
          if bodyEntered
            bodyLines.push line
          else
            headersLines.push line
      
      parsed.headers = @parseHeaders headersLines.join(HTTP_LINE_DELIMITER)
      parsed.body = bodyLines.join HTTP_LINE_DELIMITER

      parsed
      

    #@responseParser = (response) ->

    @toCamelCase = (input) -> 
      result = input.replace /\s([a-z])/g, (strings) -> 
        strings[1].toUpperCase()
      result

    @toPascalCase = (input) ->
      result = input.replace /(\w)(\w*)/g, (g0,g1,g2) -> 
        return g1.toUpperCase() + g2.toLowerCase()
      result = result.replace " ", ''
    
    callback this

  this.World = myWorld