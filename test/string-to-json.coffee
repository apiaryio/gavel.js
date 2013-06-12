{assert} = require('chai')

{StringToJson} = require('../src/string-to-json')

sampleText =  """
              a
              b
              c
              d
              """

describe 'StringToJson', ->
  stj = new StringToJson sampleText
    
  describe '#constructor', ->
    
    it 'should assign @text', ->
      assert.strictEqual stj.text, sampleText

    it 'should assign @json', ->
      assert.isDefined stj.json
  
  describe '#generate', ->
    it 'should return hash', ->
      assert.typeOf stj.generate(), 'object' 
    
    describe 'returned hash', -> 
      it 'should be same size as input text line count', ->
        assert.equal Object.keys(stj.generate()).length,
          sampleText.split('\n').length

      it 'should contain all input text lines', ->
        lines = sampleText.split('\n')
        
        for k,v of stj.generate()
          index = lines.indexOf v
          if index > -1
            lines.splice index, 1

        assert.equal lines.length, 0
        
      describe 'each entry\'s key', ->
        it 'should match prefix of hash with line number in original text', ->
          lines = sampleText.split('\n')

          for k,v of stj.generate()
            lineNumber = parseInt(k.split('-')[0])
            assert.equal lines[lineNumber], v
