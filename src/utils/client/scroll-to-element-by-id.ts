/**
 * Gets an element by its id, and then if that element exists in the document,
 * scrolls it into view. Useful for scrolling to the first non-valid element in
 * a form when it is a non-tabbable element, such as a Cloudflare Turnstile
 * widget container.
 *
 * @param id - The id of the element to scroll into view.
 */
export function scrollToElementById(id: string) {
  const element = document.getElementById(id);
  /* istanbul ignore else */
  if (element) {
    window.scrollTo({ top: element.offsetTop });
  }
}
