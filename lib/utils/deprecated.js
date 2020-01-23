/* eslint-disable no-console */

/**
 * Outputs a deprecation message.
 * Supports silencing the messages based on the environmental variable.
 * @param {string} message
 */
module.exports = function deprecated(message) {
  const shouldOutputMessage =
    typeof process === 'undefined' ||
    !process.env.SUPPRESS_DEPRECATION_WARNINGS;

  if (shouldOutputMessage) {
    console.warn(`DEPRECATED: ${message}`);
  }
};
