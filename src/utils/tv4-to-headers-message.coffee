module.exports = (message) ->
  if message.indexOf("Missing required property:") > 1
    headerName = message.split("Missing required property: ")[1]
    newMessage = "Header '#{headerName}' is missing"

  else if message.indexOf("No enum match for: ") > 1
    splitted = message.split '\' No enum match for: "'

    headerName = splitted[0]
    headerName = headerName.replace(/^At '\//, '')

    headerValue = splitted[1]
    headerValue = headerValue.replace(/"$/, '')


    newMessage = "Header '#{headerName}' doesn't have value '#{headerValue}'"

  else
    throw new Error 'Unknown tv4 error message can\'t convert to headers message.'

  return newMessage