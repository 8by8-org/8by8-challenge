/**
 * Mocks the Web Share API for testing!
 *
 * Learn more about Object.defineProperty and the writable flag:
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty | MDN Object.defineProperty}.
 * */
export function mockShareAPI() {
  Object.defineProperty(navigator, 'share', {
    value: jest.fn(),
    writable: true,
  });

  Object.defineProperty(navigator, 'canShare', {
    value: jest.fn(),
    writable: true,
  });
}
