import {
  SubFormTemplate,
  Adapter,
  Field,
  PersistentField,
  FormFactory,
  IAdapter,
  TransientField,
  NonTransientField,
  Validator,
  ValidityUtils,
} from 'fully-formed';
import { ZipCodeValidator } from '../utils/zip-code-validator';

class EligibilityTemplate extends SubFormTemplate {
  public readonly name = 'eligibility';
  public readonly id = 'voter-registration/eligibility';
  public readonly autoTrim = {
    include: ['email', 'zip'],
  };

  public readonly fields: [
    NonTransientField<'email', string>,
    NonTransientField<'zip', string>,
    TransientField<'dob', string>,
    NonTransientField<'eighteenPlus', boolean>,
    NonTransientField<'isCitizen', boolean>,
    NonTransientField<'firstTimeRegistrant', boolean>,
  ];

  public readonly adapters: [IAdapter<'dob', string>];

  private readonly key = 'eligibility';

  public constructor(email: string) {
    super();
    this.fields = [
      new Field({
        name: 'email',
        defaultValue: email,
      }),
      new PersistentField({
        name: 'zip',
        key: this.key + '.zip',
        defaultValue: '',
        validators: [new ZipCodeValidator()],
      }),
      new PersistentField({
        name: 'dob',
        key: this.key + '.dob',
        defaultValue: '',
        validators: [
          new Validator({
            predicate: value => {
              value = value.trim();
              const millis = new Date(value).getMilliseconds();
              return !Number.isNaN(millis);
            },
            invalidMessage: 'Please enter a valid date.',
          }),
        ],
        transient: true,
      }),
      new PersistentField({
        name: 'eighteenPlus',
        key: this.key + '.eighteenPlus',
        defaultValue: false,
        validatorTemplates: [
          {
            predicate: value => {
              return value;
            },
            invalidMessage:
              'You must be at least 18 years old by the next election to vote.',
          },
        ],
      }),
      new PersistentField({
        name: 'isCitizen',
        key: this.key + '.isCitizen',
        defaultValue: false,
        validatorTemplates: [
          {
            predicate: value => {
              return value;
            },
            invalidMessage: 'You must be a US Citizen to vote.',
          },
        ],
      }),
      new PersistentField({
        name: 'firstTimeRegistrant',
        key: this.key + '.firstTimeRegistrant',
        defaultValue: false,
      }),
    ];

    this.adapters = [
      new Adapter({
        name: 'dob',
        source: this.fields[2],
        adaptFn: ({ value, validity }) => {
          if (!ValidityUtils.isValid(validity)) return '';

          const [year, month, day] = value.trim().split('-');

          // Rock the Vote expects the format MM-dd-yyyy
          return `${month}-${day}-${year}`;
        },
      }),
    ];
  }
}

export const EligibilityForm = FormFactory.createSubForm(EligibilityTemplate);
