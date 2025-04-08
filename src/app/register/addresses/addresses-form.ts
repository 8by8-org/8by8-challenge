import { SubFormTemplate, FormFactory, type FieldOfType } from 'fully-formed';
import { HomeAddressForm } from './home-address/home-address-form';
import { MailingAddressForm } from './mailing-address/mailing-address-form';
import { PreviousAddressForm } from './previous-address/previous-address-form';

export const AddressesForm = FormFactory.createSubForm(
  class AddressesTemplate extends SubFormTemplate {
    public readonly name = 'addresses';
    public readonly id = 'voter-registration/addresses';
    public readonly fields: [
      InstanceType<typeof HomeAddressForm>,
      InstanceType<typeof MailingAddressForm>,
      InstanceType<typeof PreviousAddressForm>,
    ];

    public constructor(externalZipCodeField: FieldOfType<string>) {
      super();
      this.fields = [
        new HomeAddressForm(externalZipCodeField),
        new MailingAddressForm(),
        new PreviousAddressForm(),
      ];
    }
  },
);
