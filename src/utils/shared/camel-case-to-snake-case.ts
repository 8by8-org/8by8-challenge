/**
 * Converts a string from camelCase to snake_case.
 */
export function camelCaseToSnakeCase(str: string) {
  return str
    .split(/(?=[A-Z])/g)
    .map(s => s.toLowerCase())
    .join('_');
}
