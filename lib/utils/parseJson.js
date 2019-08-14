/**
 * Parses JSON.
 *
 * Previously we've used jsonlint and jju for parsing. While we've stepped
 * back to use plain JSON.parse(), we keep our doors open to switch the parser
 * - which is the reason why this is abstracted into parseJson()
 */
const parseJson = (json, revivew) => {
  return JSON.parse(json, revivew);
};

module.exports = parseJson;
