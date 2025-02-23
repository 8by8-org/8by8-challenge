/**
 * Extracts the keys of an object that correspond to methods.
 *
 * This utility type ensures that a key in the object `T` maps to a value
 * that is a function. If the value is not a function, the key is excluded!
 *
 * @template T - The object type from which method keys are extracted.
 *
 * @returns A union of the keys that correspond to methods
 */
type MethodKeys<T extends object> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

/**
 * Saves the original implementation of a method from an object.
 *
 * This function creates a wrapper around the specified method of an object
 * and ensures that the original implementation is preserved, even if the
 * method is mocked or overridden later.
 *
 * @remarks
 * The `.call` method is used to ensure the correct `this` context when
 * invoking the original method. Learn more here:
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call | MDN Function.prototype.call}.
 *
 * @template T - The type of the object containing the method.
 * @template K - The keys of `T` that correspond to methods (as determined by `MethodKeys<T>`).
 *
 * @param object - The object that contains the method to be saved.
 * @param methodName - The name of the method whose implementation is to be saved.
 *
 * @returns A function that replicates the original behavior of the specified method.
 */
export function saveActualImplementation<
  T extends object,
  K extends MethodKeys<T>,
>(object: T, methodName: K) {
  const method = object[methodName] as (...args: any[]) => any;

  return function (...args: any[]) {
    return method.call(object, ...args);
  } as T[K];
}
