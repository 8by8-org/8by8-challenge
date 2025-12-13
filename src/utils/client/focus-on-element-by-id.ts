/**
 * Takes in the `id` of an HTML element and focuses on that element if it exists
 * in the document. Useful for focusing on the first invalid input in a form
 * when the user submits it while the form still has invalid fields.
 *
 * @param id - The `id` of the element on which to call `focus()`.
 *
 * @remarks
 * If the `disabled` attribute is controlled by a React state variable, such as
 * `isLoading`, there is a delay between setting this variable to false and
 * the actual removal of the `disabled` attribute. Therefore, in order to be
 * able to focus on the element immediately after this variable changes while
 * still being able to control whether the element is disabled using React state,
 * this function removes the `disabled` attribute from the element before calling
 * its `focus()` method.
 */
export function focusOnElementById(id: string) {
  const element = document.getElementById(id);
  /* istanbul ignore else */
  if (element) {
    element.removeAttribute('disabled');
    element.focus();
  }
}
