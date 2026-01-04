import { ValidityUtils, type IForm, type ValueOf } from 'fully-formed';
import { FormInvalidError } from './form-invalid-error';

/**
 * Waits for a pending form to become either valid/caution or invalid, and then
 * resolves with the value of the form if valid, or calls `reject()` if
 * invalid.
 *
 * @param form - A Fully Formed {@link IForm}.
 *
 * @returns A `Promise` that resolves with the value of the form, if valid.
 */
export function waitForPendingValidators<T extends IForm>(form: T) {
  return new Promise<ValueOf<T>>((resolve, reject) => {
    if (ValidityUtils.isValid(form)) {
      resolve(form.state.value);
    } else if (ValidityUtils.isInvalid(form)) {
      reject(new FormInvalidError());
    } else {
      const subscription = form.subscribeToState(state => {
        // prettier-ignore
        if (ValidityUtils.isValidOrCaution(state)) {
          subscription.unsubscribe();
          resolve(state.value);
        } else /* istanbul ignore else */ if (ValidityUtils.isInvalid(state)) {
          subscription.unsubscribe();
          reject(new FormInvalidError());
        }
      });
    }
  });
}
