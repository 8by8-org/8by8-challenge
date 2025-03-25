/**
 * Reads the value of a cookie by its name.
 *
 * This function retrieves the value of a specified cookie from `document.cookie`.
 * If the cookie is not found, it returns an empty string.
 *
 * @example
 * ```typescript
 * document.cookie = "username=JohnDoe";
 * const username = readCookie("username");
 * console.log(username); // Output: "JohnDoe"
 * ```
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string} The value of the cookie, or an empty string if not found.
 */
export function readCookie(name: string): string {
  name += '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookies = decodedCookie.split(';');

  for (const cookie of cookies) {
    const indexOfName = cookie.indexOf(name);
    if (indexOfName === -1) continue;

    return cookie.substring(indexOfName + name.length);
  }

  return '';
}
