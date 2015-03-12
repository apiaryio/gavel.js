{assert} = require('chai')
clone    = require 'clone'
{validate, isValid, isValidatable} = require('../../src/validate')
fixtures = require '../fixtures'

describe 'Gavel proxies to functions with callbacks', ->

  # Examples from README.md
  baseHttpMessage =
    "statusCode": "200"
    "headers":
      "content-type": "application/json"
      "date": "Wed, 03 Jul 2013 13:30:53 GMT"
      "server": "gunicorn/0.17.4"
      "content-length": "30"
      "connection": "keep-alive"
    "body": "{\n  \"origin\": \"94.113.241.2\"\n}"

  cloneHttpMessage = clone baseHttpMessage, false

  differentHttpMessage =
    "statusCode": "404"
    "headers":
      "content-type": "application/vnd.gavel.vX+json" # different from baseHttpMessage
      "date": "Wed, 03 Jul 2014 13:30:53 GMT"
      "server": "Apache/2.42"     # different from baseHttpMessage
      "connection": "close"       # different from baseHttpMessage
                                  # missing key "content-length"
    "body": "{\"r2\":\"d2\"}"

  similarHttpMessage =
    "statusCode": "200"
    "headers":
      "CONTENT-TYPE": "application/json"
      "DATE": "Mon, 01 Jan 2011 01:01:01 GMT" # shall ignore DATE header differences
      "SERVER": "gunicorn/0.17.4"
      "CONTENT-LENGTH": "30"
      "CONNECTION": "keep-alive"
    "body": "{\"origin\":\"1.2.3.4\"}"

  describe 'isValidatable', ->
    describe 'when I provide data from README (good objects)', ->
      for variant in ['response', 'request'] then do (variant) ->
        describe "for two cloned #{variant}s", ->
          results = null
          error = null

          before (done) ->
            isValidatable cloneHttpMessage, baseHttpMessage, variant, (err, result) ->
              error = err
              results = result
              done()

          it 'should call the callback without any errors', -> assert.isNull error
          it 'should be ok as a result of isValidatable', -> assert.isTrue results

        describe "for similar #{variant}s", ->
          results = null
          error = null

          before (done) ->
            isValidatable similarHttpMessage, baseHttpMessage, variant, (err, result) ->
              error = err
              results = result
              done()

          it 'should call the callback without any errors', -> assert.isNull error
          it 'should be ok as a result of isValidatable', -> assert.isTrue results

        describe "for different #{variant}s", ->
          results = null
          error = null

          before (done) ->
            isValidatable differentHttpMessage, baseHttpMessage, variant, (err, result) ->
              error = err
              results = result
              done()

          it 'should call the callback without any errors', -> assert.isNull error
          it 'should be ok as a result of isValidatable', -> assert.isTrue results


  describe 'isValid', ->
    describe 'when I provide data', ->
      for variant in ['response', 'request'] then do (variant) ->
        describe "for two cloned #{variant}s", ->
          results = null
          error = null

          before (done) ->
            isValid cloneHttpMessage, baseHttpMessage, variant, (err, result) ->
              error = err
              results = result
              done()

          it 'should call the callback without any errors', -> assert.isNull error
          it 'should be true as a result of isValid', -> assert.isTrue results

        describe "for similar #{variant}s", ->
          results = null
          error = null

          before (done) ->
            isValid similarHttpMessage, baseHttpMessage, variant, (err, result) ->
              error = err
              results = result
              done()

          it 'should call the callback without any errors', -> assert.isNull error
          it 'should be ok as a result of isValid', -> assert.isTrue results

        describe "for different #{variant}s", ->
          results = null
          error = null

          before (done) ->
            isValid differentHttpMessage, baseHttpMessage, variant, (err, result) ->
              error = err
              results = result
              done()

          it 'should call the callback without any errors', -> assert.isNull error
          it 'should be false as a result of isValid', -> assert.isFalse results


  describe 'validate', ->
    describe 'when I provide data', ->
      for variant in ['response', 'request'] then do (variant) ->
        describe "for two cloned #{variant}s", ->
          results = null
          error = null

          before (done) ->
            validate cloneHttpMessage, baseHttpMessage, variant, (err, result) ->
              error = err
              results = result
              done()

          it 'should call the callback without any errors', -> assert.isNull error
          it 'should results be an object', -> assert.isObject results

        describe "for similar #{variant}s", ->
          results = null
          error = null

          before (done) ->
            validate similarHttpMessage, baseHttpMessage, variant, (err, result) ->
              error = err
              results = result
              done()

          it 'should call the callback without any errors', -> assert.isNull error
          it 'should results be an object', -> assert.isObject results

        describe "for different #{variant}s", ->
          results = null
          error = null

          before (done) ->
            validate differentHttpMessage, baseHttpMessage, variant, (err, result) ->
              error = err
              results = result
              done()

          it 'should call the callback without any errors', -> assert.isNull error
          it 'should results be an object', -> assert.isObject results
          it 'should results contain 2 different headers messages (missing content-length, different content-type)', ->
            assert.isObject results
            assert.property results, 'headers'
            assert.isObject results.headers
            assert.isArray results.headers.results
            assert.lengthOf results.headers.results, 2
