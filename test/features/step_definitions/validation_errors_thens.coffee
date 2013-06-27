util = require('util')

validationErrorsThens = () ->
  Given = When = Then = @.defineStep
  
  Then /^it should set some error for "([^"]*)"$/, (target, callback) ->
    target = toCamelCase(target)
    result = @.hit.validationResults() 
    targetResult = result.response[target] || {}
    errorsCount = Object.keys(targetResult).length
    
    if not errorsCount > 0
      callback.fail "Expected validation errors on '" + target + "', but there are no validation errors."  
  
    callback()
    
  Then /^it should not set any errors for "([^"]*)"$/, (target, callback) ->
    target = toCamelCase(target)
    result = @.hit.validationResults()
    targetResult = result.response[target] || {}
    errorsCount = Object.keys(targetResult).length
    #inspect = util.inspect(targetResult, { depth: null })

    if errorsCount > 0
      callback.fail "No errors on '" + target + "' expected, but there are " + errorsCount + " validation errors."

    callback()
  
  toCamelCase = (input) -> 
    result = input.replace /\s([a-z])/g, (strings) -> 
      strings[1].toUpperCase()
    result
  return 

module.exports = validationErrorsThens