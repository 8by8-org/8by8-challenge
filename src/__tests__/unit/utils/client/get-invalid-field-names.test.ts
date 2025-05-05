import { getInvalidFieldNames } from '@/utils/client/get-invalid-field-names';
import {
  FormFactory,
  FormTemplate,
  SubFormTemplate,
  ExcludableTemplate,
  Field,
  ExcludableField,
  IValidator,
  ValidatorResult,
  Validity,
} from 'fully-formed';

describe('getInvalidFieldNames', () => {
  class CautionValidator implements IValidator<string> {
    validate(): ValidatorResult {
      return {
        validity: Validity.Caution,
      };
    }
  }

  class PendingValidator implements IValidator<string> {
    validate(): ValidatorResult {
      return {
        validity: Validity.Pending,
      };
    }
  }

  class InvalidValidator implements IValidator<string> {
    validate(): ValidatorResult {
      return {
        validity: Validity.Invalid,
      };
    }
  }

  it('returns a list of invalid fields.', () => {
    const invalidFieldNames = ['field1', 'field2'] as const;

    class TestTemplate extends FormTemplate {
      fields = [
        new Field({
          name: invalidFieldNames[0],
          defaultValue: '',
          validators: [new InvalidValidator()],
        }),
        new Field({
          name: invalidFieldNames[1],
          defaultValue: '',
          validators: [new InvalidValidator()],
        }),
      ];
    }

    const TestForm = FormFactory.createForm(TestTemplate);
    const testFormInstance = new TestForm();
    expect(getInvalidFieldNames(testFormInstance)).toEqual(invalidFieldNames);
  });

  it('does not return any valid, caution, or pending fields.', () => {
    class TestTemplate extends FormTemplate {
      fields = [
        new Field({
          name: 'validField',
          defaultValue: '',
        }),
        new Field({
          name: 'cautionField',
          defaultValue: '',
          validators: [new CautionValidator()],
        }),
        new Field({
          name: 'pendingField',
          defaultValue: '',
          validators: [new PendingValidator()],
        }),
      ] as const;
    }

    const TestForm = FormFactory.createForm(TestTemplate);
    const testFormInstance = new TestForm();
    expect(getInvalidFieldNames(testFormInstance)).toEqual([]);
  });

  it('does not include any excluded invalid fields.', () => {
    class TestTemplate extends FormTemplate {
      fields = [
        new ExcludableField({
          name: 'excludedField',
          defaultValue: '',
          validators: [new InvalidValidator()],
          excludeByDefault: true,
        }),
      ];
    }
    const TestForm = FormFactory.createForm(TestTemplate);
    const testFormInstance = new TestForm();
    expect(getInvalidFieldNames(testFormInstance)).toEqual([]);
  });

  // subforms
  it('includes the fields of subforms.', () => {
    class InnerTemplate extends SubFormTemplate {
      readonly name = 'innerSubForm';
      readonly fields = [
        new Field({
          name: 'someOtherField',
          defaultValue: '',
          validators: [new InvalidValidator()],
        }),
      ] as const;
    }

    const InnerSubForm = FormFactory.createSubForm(InnerTemplate);

    class OuterTemplate extends SubFormTemplate {
      readonly name = 'outerSubForm';
      readonly fields = [
        new Field({
          name: 'someField',
          defaultValue: '',
          validators: [new InvalidValidator()],
        }),
        new InnerSubForm(),
      ] as const;
    }

    const OuterSubForm = FormFactory.createSubForm(OuterTemplate);

    class RootTemplate extends FormTemplate {
      readonly fields = [new OuterSubForm()];
    }

    const RootForm = FormFactory.createForm(RootTemplate);
    const rootFormInstance = new RootForm();
    expect(getInvalidFieldNames(rootFormInstance)).toEqual([
      'outerSubForm/someField',
      'outerSubForm/innerSubForm/someOtherField',
    ]);
  });

  it('does not include the fields of excluded sub forms.', () => {
    class ExcludableSubFormTemplate
      extends SubFormTemplate
      implements ExcludableTemplate
    {
      readonly name = 'ExcludableSubForm';
      readonly fields = [
        new Field({
          name: 'someField',
          defaultValue: '',
          validators: [new InvalidValidator()],
        }),
      ];
      excludeByDefault = true;
    }

    const ExcludableSubForm = FormFactory.createExcludableSubForm(
      ExcludableSubFormTemplate,
    );

    class RootTemplate extends FormTemplate {
      readonly fields = [new ExcludableSubForm()] as const;
    }

    const RootForm = FormFactory.createForm(RootTemplate);
    const rootFormInstance = new RootForm();
    expect(getInvalidFieldNames(rootFormInstance)).toEqual([]);
  });
});
