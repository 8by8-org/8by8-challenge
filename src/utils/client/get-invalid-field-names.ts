import { isExcludable, ValidityUtils, type IForm } from 'fully-formed';

/**
 * Returns the names of all invalid fields of a form and its subforms,
 * prepending the names of subforms to those of their fields.
 */
export function getInvalidFieldNames(form: IForm): string[] {
  const fieldNames: string[] = [];
  getInvalidFieldNamesRecursive(form, fieldNames);
  return fieldNames;
}

function getInvalidFieldNamesRecursive(
  form: IForm,
  invalidFieldNames: string[],
  prefix = '',
): void {
  for (const descendant of Object.values(form.fields)) {
    if (
      ValidityUtils.isInvalid(descendant) &&
      (!isExcludable(descendant) || !descendant.state.exclude)
    ) {
      if ('fields' in descendant) {
        getInvalidFieldNamesRecursive(
          descendant as unknown as IForm,
          invalidFieldNames,
          prefix ? prefix + '/' + descendant.name : descendant.name,
        );
      } else {
        invalidFieldNames.push(
          prefix ? prefix + '/' + descendant.name : descendant.name,
        );
      }
    }
  }
}
