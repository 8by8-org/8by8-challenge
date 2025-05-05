import { camelCaseToSnakeCase } from '@/utils/shared/camel-case-to-snake-case';

describe('camelCaseToSnakeCase', () => {
  it('converts a string from camelCase to snake_case', () => {
    const originalStr = 'aTestStringToConvert';
    const expectedResult = 'a_test_string_to_convert';
    expect(camelCaseToSnakeCase(originalStr)).toBe(expectedResult);
  });

  it('returns an empty string when it receives one.', () => {
    expect(camelCaseToSnakeCase('')).toBe('');
  });

  it('leaves a string containing only lowercase letters, numbers, and symbols unchanged.', () => {
    const originalStr = 'lowercase0123456789!@#$%^&*()_+=';
    expect(camelCaseToSnakeCase(originalStr)).toBe(originalStr);
  });

  it('does not preface a leading uppercase character with an underscore.', () => {
    const originalStr = 'PascalCaseIsNiceForClasses';
    const expectedResult = 'pascal_case_is_nice_for_classes';
    expect(camelCaseToSnakeCase(originalStr)).toBe(expectedResult);
  });
});
