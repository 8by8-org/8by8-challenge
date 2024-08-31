import {
  FormFactory,
  SubFormTemplate,
  PersistentField,
  PersistentControlledField,
  StringValidators,
  ValidityUtils,
  type IField,
  type FieldOfType,
} from 'fully-formed';
import zipState from 'zip-state';
import { ZipCodeValidator } from '../../utils/zip-code-validator';
import { PhoneValidator } from '../../utils/phone-validator';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';

export const HomeAddressForm = FormFactory.createSubForm(
  class HomeAddressTemplate extends SubFormTemplate {
    public readonly name = 'homeAddress';
    public readonly autoTrim = true;
    public readonly fields: [
      IField<'streetLine1', string, true>,
      IField<'streetLine2', string, true>,
      IField<'unit', string, false>,
      IField<'city', string, false>,
      IField<'state', string, false>,
      IField<'zip', string, false>,
      IField<'phone', string, false>,
      IField<'phoneType', string, false>,
    ];

    private readonly key = 'addresses.home';

    public constructor(externalZipCodeField: FieldOfType<string>) {
      super();

      const zip = new PersistentControlledField({
        name: 'zip',
        key: this.key + '.zip',
        controller: externalZipCodeField,
        initFn: controllerState => {
          return controllerState.value;
        },
        controlFn: controllerState => controllerState.value,
        validators: [new ZipCodeValidator()],
      });

      const state = new PersistentControlledField({
        name: 'state',
        controller: zip,
        key: this.key + '.state',
        initFn: controllerState => {
          if (!ValidityUtils.isValid(controllerState)) {
            return 'AL';
          }

          const state = zipState(controllerState.value);
          if (!state || !Object.values(US_STATE_ABBREVIATIONS).includes(state))
            return 'AL';

          return state;
        },
        controlFn: controllerState => {
          if (
            !ValidityUtils.isValid(controllerState) ||
            !controllerState.didPropertyChange('value')
          )
            return;

          const state = zipState(controllerState.value.trim());
          if (
            !state ||
            !Object.values(US_STATE_ABBREVIATIONS).includes(state)
          ) {
            return;
          }
          return state;
        },
      });

      this.fields = [
        new PersistentField({
          name: 'streetLine1',
          key: this.key + '.streetLine1',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your street address.',
            }),
          ],
        }),
        new PersistentField({
          name: 'streetLine2',
          key: this.key + '.streetLine2',
          defaultValue: '',
        }),
        new PersistentField({
          name: 'unit',
          key: this.key + '.unit',
          defaultValue: '',
        }),
        new PersistentField({
          name: 'city',
          key: this.key + '.city',
          defaultValue: '',
          validators: [
            StringValidators.required({
              invalidMessage: 'Please enter your city.',
            }),
          ],
        }),
        state,
        zip,
        new PersistentField({
          name: 'phone',
          key: this.key + '.phone',
          defaultValue: '',
          validators: [new PhoneValidator()],
        }),
        new PersistentField({
          name: 'phoneType',
          key: this.key + '.phoneType',
          defaultValue: 'Mobile',
        }),
      ];
    }
  },
);
