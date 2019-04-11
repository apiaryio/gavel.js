const caseless = require('caseless')

module.exports = (message, expectedHeaders) => {
  let headerName
  let newMessage

  if (message.includes('Missing required property:')) {
    headerName = message.split('Missing required property: ')[1]
    newMessage = `Header '${headerName}' is missing`
  } else if (message.includes('No enum match for: ')) {
    splitted = message.split('\' No enum match for: "')

    headerName = splitted[0]
    headerName = headerName.replace(/^At '\//, '')

    headerValue = splitted[1]
    headerValue = headerValue.replace(/"$/, '')

    expected = caseless(expectedHeaders).get(headerName)
    newMessage = `Header '${headerName}' has value '${headerValue}' instead of '${expected}'`
  } else {
    throw new Error(
      "Unknown tv4 error message can't convert to headers message.",
    )
  }

  return newMessage
}
