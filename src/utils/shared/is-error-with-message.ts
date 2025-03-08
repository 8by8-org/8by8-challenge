interface ErrorWithMessage {
  message: string;
}
/**
 * Checks if a given value is an error object with a message property.
 *
 * @param {unknown} error - The value to check.
 * @returns {error is ErrorWithMessage} `true` if the value is an error with a message, otherwise `false`.
 */
export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    !!error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string' &&
    !!error.message.length
  );
}
