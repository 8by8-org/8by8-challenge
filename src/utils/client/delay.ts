/**
 * Delays execution for a specified number of milliseconds.
 *
 * This function returns a Promise that resolves after the given delay.
 * It can be used to pause execution in asynchronous workflows.
 *
 * @example
 * ```typescript
 * async function demo() {
 *   console.log("Start");
 *   await delay(2000); // Waits for 2 seconds
 *   console.log("End");
 * }
 * ```
 *
 * @param {number} ms - The number of milliseconds to delay execution.
 * @returns {Promise<void>} A Promise that resolves after the specified time.
 */
export function delay(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}
