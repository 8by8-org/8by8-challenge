/**
 * Replaces a segment of a string with a specified replacement string.
 *
 * @param {string} str - The original string.
 * @param {string} replacementStr - The string to insert in place of the segment.
 * @param {number} start - The starting index (inclusive) of the segment to replace.
 * @param {number} end - The ending index (exclusive) of the segment to replace.
 * @returns {string} A new string with the specified segment replaced.
 */
export function replaceStringSegment(
  str: string,
  replacementStr: string,
  start: number,
  end: number,
) {
  return str.slice(0, start) + replacementStr + str.slice(end);
}
