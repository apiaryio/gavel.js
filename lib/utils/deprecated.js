/* eslint-disable no-console */

/**
 * Outputs a deprecation message.
 * Supports silencing the messages based on the environmental variable.
 * @param {string} message
 */
module.exports = function deprecated(message) {
  const isNode = typeof process !== 'undefined';
  const shouldSuppressWarnings =
    isNode && process.env.SUPPRESS_DEPRECATION_WARNINGS;
  const shouldOutputMessage = isNode ? !shouldSuppressWarnings : true;

  if (shouldOutputMessage) {
    console.warn(`DEPRECATED: ${message}`);
  }
};
