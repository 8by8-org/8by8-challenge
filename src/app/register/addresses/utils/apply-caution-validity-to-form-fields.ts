import { Validity } from 'fully-formed';
import { AddressesForm } from '../addresses-form';
import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import type { AddressErrors } from '@/model/types/addresses/address-errors';
import type { AddressComponent } from '@/model/types/addresses/address-component';

export function applyCautionValidityToFormFields(
  form: InstanceType<typeof AddressesForm>,
  errors: AddressErrors[],
) {
  errors.forEach(error => {
    // prettier-ignore
    if (error.type === AddressErrorTypes.MissingSubpremise) {
      form.fields[error.form].fields.streetLine2.setValidityAndMessages(
        Validity.Caution,
        [],
      );
    } else if (error.type === AddressErrorTypes.ReviewRecommendedAddress) {
      for (const entry of Object.entries(error.enteredAddress)) {
        const [fieldName, addressComponent] = entry as [
          keyof (typeof form.fields)[(typeof error)['form']]['fields'],
          AddressComponent,
        ];

        if (addressComponent.hasIssue) {
          form.fields[error.form].fields[fieldName].setValidityAndMessages(
            Validity.Caution,
            [],
          );
        }
      }
    } else /* istanbul ignore else */ if (error.type === AddressErrorTypes.UnconfirmedComponents) {
      for (const entry of Object.entries(error.unconfirmedAddressComponents)) {
        const [fieldName, addressComponent] = entry as [
          keyof (typeof form.fields)[(typeof error)['form']]['fields'],
          AddressComponent,
        ];

        if (addressComponent.hasIssue) {
          form.fields[error.form].fields[fieldName].setValidityAndMessages(
            Validity.Caution,
            [],
          );
        }
      }
    }
  });
}
