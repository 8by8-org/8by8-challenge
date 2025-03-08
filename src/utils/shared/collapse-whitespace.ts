/**
 * Collapses multiple whitespace characters in a string into a single space.
 * Trims leading and trailing whitespace.
 *
 * @param {string} str - The input string to process.
 * @returns {string} The processed string with collapsed whitespace.
 */
export function collapseWhitespace(str: string) {
  return str.trim().replace(/(\s+)/g, ' ');
}
