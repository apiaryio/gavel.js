const caseless = require('caseless');

module.exports = (message, expectedHeaders) => {
  let newMessage;

  if (message.includes('Missing required property:')) {
    const headerName = message.split('Missing required property: ')[1];
    newMessage = `Header '${headerName}' is missing`;
  } else if (message.includes('No enum match for: ')) {
    const splitted = message.split('\' No enum match for: "');
    const headerName = splitted[0].replace(/^At '\//, '');
    const headerValue = splitted[1].replace(/"$/, '');

    const expected = caseless(expectedHeaders).get(headerName);
    newMessage = `Header '${headerName}' has value '${headerValue}' instead of '${expected}'`;
  } else {
    throw new Error(
      "Unknown tv4 error message can't convert to headers message."
    );
  }

  return newMessage;
};
