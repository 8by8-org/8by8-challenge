/**
 * Mocks the .animate() function for testing as it is only available in the browser.
 */
export function mockAnimate() {
  HTMLElement.prototype.animate = jest.fn();
}
