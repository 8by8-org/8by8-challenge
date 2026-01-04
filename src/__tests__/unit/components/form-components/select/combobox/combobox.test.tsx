import { Combobox } from '@/components/form-components/select/combobox';
import { render, screen, cleanup, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {
  Field,
  StringValidators,
  Validator,
  Group,
  Validity,
  IValidator,
  GroupValue,
} from 'fully-formed';
import zipState from 'zip-state';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';
import { validate } from 'uuid';

describe('Combobox', () => {
  afterEach(cleanup);

  it('renders an element with the "combobox" role.', () => {
    render(
      <Combobox
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: '' })}
        groups={[]}
        options={[]}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    expect(screen.queryByRole('combobox')).toBeInTheDocument();
  });

  it(`renders an element whose aria-label matches the label it 
  receives.`, () => {
    const label = 'Select an option';

    render(
      <Combobox
        label={label}
        field={new Field({ name: 'testField', defaultValue: '' })}
        groups={[]}
        options={[]}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('aria-label')).toBe(label);
  });

  it(`displays the label when the value of the field is an empty 
  string.`, () => {
    const label = 'Select an option';

    render(
      <Combobox
        label={label}
        field={new Field({ name: 'testField', defaultValue: '' })}
        groups={[]}
        options={[]}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    expect(screen.queryByText(label)).toBeInTheDocument();
  });

  it('displays the value of the field when it is not an empty string.', () => {
    const label = 'Select an option';
    const selectedOption = {
      text: 'Option 1',
      value: 'option 1',
    };

    render(
      <Combobox
        label={label}
        field={
          new Field({ name: 'testField', defaultValue: selectedOption.value })
        }
        groups={[]}
        options={[selectedOption]}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    expect(screen.queryByText(label)).not.toBeInTheDocument();
    expect(screen.queryByText(selectedOption.text)).toBeInTheDocument();
  });

  it(`applies the "invalid" class to the element containing the combobox and 
  sets the aria-invalid attribute of the combobox to "true" when the field is 
  invalid and has been blurred.`, async () => {
    const field = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    render(
      <Combobox
        label="Select an option"
        field={field}
        groups={[]}
        options={[]}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('invalid');

    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('aria-invalid')).toBe('false');

    act(() => field.blur());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('true');
  });

  it(`applies the "invalid" class to the element containing the combobox and 
  sets the aria-invalid attribute of the combobox to "true" when the field is 
  invalid and has been modified.`, async () => {
    const options = [
      {
        text: 'Invalid option',
        value: 'invalid',
      },
      {
        text: 'Valid option',
        value: 'valid',
      },
    ];

    const field = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [
        StringValidators.required(),
        new Validator<string>({
          predicate: value => {
            return value !== 'invalid';
          },
        }),
      ],
    });

    render(
      <Combobox
        label="Select an option"
        field={field}
        groups={[]}
        options={options}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('invalid');

    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('aria-invalid')).toBe('false');

    act(() => field.setValue(options[0].value));
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('true');
  });

  it(`applies the "invalid" class to the element containing the combobox and 
  sets the aria-invalid attribute of the combobox to true when the field is 
  invalid and has been submitted.`, async () => {
    const field = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    render(
      <Combobox
        label="Select an option"
        field={field}
        groups={[]}
        options={[]}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('invalid');

    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('aria-invalid')).toBe('false');

    act(() => field.setSubmitted());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('true');
  });

  it(`applies the "invalid" class to the element containing the combobox and 
  sets the aria-invalid attribute of the combobox to "true" if any of the groups 
  it received have been determined to be invalid by their validators and the 
  field has been blurred.`, async () => {
    const zip = new Field({
      name: 'zip',
      defaultValue: '19022', // PA zip code
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validatorTemplates: [
        {
          predicate: ({ zip, state }) => {
            return zipState(zip) === state;
          },
        },
      ],
    });

    render(
      <Combobox
        label="State"
        field={state}
        groups={[zipCodeAndState]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('invalid');

    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('aria-invalid')).toBe('false');

    act(() => state.blur());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('true');
  });

  it(`applies the "invalid" class to the element containing the combobox and 
  sets the aria-invalid attribute of the combobox to "true" if any of the groups 
  it received have been determined to be invalid by their validators and the 
  field has been modified.`, async () => {
    const zip = new Field({
      name: 'zip',
      defaultValue: '19022', // PA zip code
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validatorTemplates: [
        {
          predicate: ({ zip, state }) => {
            return zipState(zip) === state;
          },
        },
      ],
    });

    render(
      <Combobox
        label="State"
        field={state}
        groups={[zipCodeAndState]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('invalid');

    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('aria-invalid')).toBe('false');

    act(() => state.setValue('WI'));
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('true');
  });

  it(`applies the "invalid" class to the element containing the combobox and 
  sets the aria-invalid attribute of the combobox to "true" if any of the groups 
  it received have been determined to be invalid by their validators and the 
  field has been submitted.`, async () => {
    const zip = new Field({
      name: 'zip',
      defaultValue: '19022', // PA zip code
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validatorTemplates: [
        {
          predicate: ({ zip, state }) => {
            return zipState(zip) === state;
          },
        },
      ],
    });

    render(
      <Combobox
        label="State"
        field={state}
        groups={[zipCodeAndState]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('invalid');

    const combobox = screen.getByRole('combobox');
    expect(combobox.getAttribute('aria-invalid')).toBe('false');

    act(() => state.setSubmitted());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('true');
  });

  it(`removes the "invalid class from the element containing the combobox and 
  sets the aria-invalid attribute of the combobox to "false" when the field 
  becomes valid.`, async () => {
    const field = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [StringValidators.required()],
    });

    const options = [
      {
        text: 'Option 1',
        value: 'option 1',
      },
    ];

    render(
      <Combobox
        label="Select an option"
        field={field}
        groups={[]}
        options={options}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    const combobox = screen.getByRole('combobox');

    act(() => field.blur());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('true');

    act(() => field.setValue(options[0].value));
    await waitFor(() =>
      expect(comboboxContainer.classList).not.toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('false');
  });

  it(`removes the "invalid" class from the element containing the combobox when
  all groups become valid.`, async () => {
    const zip = new Field({
      name: 'zip',
      defaultValue: '19022', // PA zip code
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validatorTemplates: [
        {
          predicate: ({ zip, state }) => {
            return zipState(zip) === state;
          },
        },
      ],
    });

    render(
      <Combobox
        label="State"
        field={state}
        groups={[zipCodeAndState]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    const combobox = screen.getByRole('combobox');

    act(() => state.blur());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('true');

    act(() => state.setValue('PA'));
    await waitFor(() =>
      expect(comboboxContainer.classList).not.toContain('invalid'),
    );
    expect(combobox.getAttribute('aria-invalid')).toBe('false');
  });

  it(`applies the "caution" class to the element containing the combobox and 
  renders a warning message when the field's validity is "caution" and it has 
  been blurred.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [
        {
          validate: () => ({
            validity: Validity.Caution,
          }),
        },
      ],
    });

    render(
      <Combobox
        label="Select an option"
        field={field}
        groups={[]}
        options={[]}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('caution');
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).not.toBeInTheDocument();

    act(() => field.blur());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).toBeInTheDocument();
  });

  it(`applies the "caution" class to the element containing the combobox and 
  renders a warning message when the field's validity is "caution" and it has 
  been modified.`, async () => {
    const options = [
      {
        text: 'Cautioned option',
        value: 'caution',
      },
      {
        text: 'Valid option',
        value: 'valid',
      },
    ];

    const field = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [
        {
          validate: () => ({
            validity: Validity.Caution,
          }),
        },
      ],
    });

    render(
      <Combobox
        label="Select an option"
        field={field}
        groups={[]}
        options={options}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('caution');
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).not.toBeInTheDocument();

    act(() => field.setValue(options[0].value));
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).toBeInTheDocument();
  });

  it(`applies the "caution" class to the element containing the combobox and 
  renders a warning message when the field's validity is "caution" and it has 
  been submitted.`, async () => {
    const field = new Field({
      name: 'requiredField',
      defaultValue: '',
      validators: [
        {
          validate: () => ({
            validity: Validity.Caution,
          }),
        },
      ],
    });

    render(
      <Combobox
        label="Select an option"
        field={field}
        groups={[]}
        options={[]}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('caution');
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).not.toBeInTheDocument();

    act(() => field.setSubmitted());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).toBeInTheDocument();
  });

  it(`applies the "caution" class to the element containing the combobox and 
  renders a warning message if any of the groups it received have been validated 
  and have a validity of "caution" and the field has been blurred.`, async () => {
    const zip = new Field({
      name: 'zip',
      defaultValue: '19022',
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validators: [
        {
          validate: () => ({
            validity: Validity.Caution,
          }),
        },
      ],
    });

    render(
      <Combobox
        label="State"
        field={state}
        groups={[zipCodeAndState]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('caution');
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).not.toBeInTheDocument();

    act(() => state.blur());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).toBeInTheDocument();
  });

  it(`applies the "caution" class to the element containing the combobox and 
  renders a warning message if any of the groups it received have been validated 
  and have a validity of "caution" and the field has been modified.`, async () => {
    const zip = new Field({
      name: 'zip',
      defaultValue: '19022',
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validators: [
        {
          validate: () => ({
            validity: Validity.Caution,
          }),
        },
      ],
    });

    render(
      <Combobox
        label="State"
        field={state}
        groups={[zipCodeAndState]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('caution');
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).not.toBeInTheDocument();

    act(() => state.setValue('WI'));
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).toBeInTheDocument();
  });

  it(`applies the "caution" class to the element containing the combobox and 
  renders a warning message if any of the groups it received have been validated 
  and have a validity of "caution" and the field has been submitted.`, async () => {
    const zip = new Field({
      name: 'zip',
      defaultValue: '19022', // PA zip code
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validators: [
        {
          validate: () => ({
            validity: Validity.Caution,
          }),
        },
      ],
    });

    render(
      <Combobox
        label="State"
        field={state}
        groups={[zipCodeAndState]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];
    expect(comboboxContainer.classList).not.toContain('caution');
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).not.toBeInTheDocument();

    act(() => state.setSubmitted());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).toBeInTheDocument();
  });

  it(`removes the "caution" class from the combobox and unmounts the warning 
  message when the field becomes valid.`, async () => {
    const field = new Field({
      name: 'testField',
      defaultValue: '',
      validators: [
        {
          validate: value => ({
            validity: value ? Validity.Valid : Validity.Caution,
          }),
        },
      ],
    });

    const options = [
      {
        text: 'Option 1',
        value: 'option 1',
      },
    ];

    render(
      <Combobox
        label="Select an option"
        field={field}
        groups={[]}
        options={options}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];

    act(() => field.blur());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).toBeInTheDocument();

    act(() => field.setValue(options[0].value));
    await waitFor(() =>
      expect(comboboxContainer.classList).not.toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).not.toBeInTheDocument();
  });

  it(`removes the "caution" class from the element containing the combobox when
  all groups become valid.`, async () => {
    const zip = new Field({
      name: 'zip',
      defaultValue: '19022', // PA zip code
    });

    const state = new Field({
      name: 'state',
      defaultValue: 'CA',
    });

    class ZipStateValidator implements IValidator<
      GroupValue<[typeof zip, typeof state]>
    > {
      validate = (value: GroupValue<[typeof zip, typeof state]>) => {
        const expectedState = zipState(value.zip);

        return {
          validity:
            expectedState !== value.state ? Validity.Caution : Validity.Valid,
        };
      };
    }

    const zipCodeAndState = new Group({
      name: 'zipCodeAndState',
      members: [zip, state],
      validators: [new ZipStateValidator()],
    });

    render(
      <Combobox
        label="State"
        field={state}
        groups={[zipCodeAndState]}
        options={Object.values(US_STATE_ABBREVIATIONS).map(abbr => {
          return {
            text: abbr,
            value: abbr,
          };
        })}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={false}
      />,
    );

    const comboboxContainer = document.getElementsByClassName('combobox')[0];

    act(() => state.blur());
    await waitFor(() =>
      expect(comboboxContainer.classList).toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).toBeInTheDocument();

    act(() => state.setValue('PA'));
    await waitFor(() =>
      expect(comboboxContainer.classList).not.toContain('caution'),
    );
    expect(
      screen.queryByText(
        'The value of this field could not be confirmed. Please verify that it is correct.',
      ),
    ).not.toBeInTheDocument();
  });

  it(`opens the menu to the first option when the user presses the ArrowDown 
  key while the combobox has focus.`, async () => {
    const options = [
      {
        text: 'Option 1',
        value: 'option 1',
      },
      {
        text: 'Option 2',
        value: 'option 2',
      },
      {
        text: 'Option 3',
        value: 'option 3',
      },
    ];

    const menuRef = {
      current: {
        openMenu: jest.fn(),
        closeMenu: jest.fn(),
        toggleMenu: jest.fn(),
      },
    };

    const user = userEvent.setup();

    render(
      <Combobox
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: '' })}
        groups={[]}
        options={options}
        menuId="menu"
        menuRef={menuRef}
        hasMoreInfo={false}
      />,
    );

    const combobox = screen.getByRole('combobox');
    combobox.focus();

    await user.keyboard('{ArrowDown}');
    expect(menuRef.current.openMenu).toHaveBeenCalledWith(0, true);
  });

  it(`opens the menu to the last option when the user presses the ArrowUp key
  while the combobox has focus.`, async () => {
    const options = [
      {
        text: 'Option 1',
        value: 'option 1',
      },
      {
        text: 'Option 2',
        value: 'option 2',
      },
      {
        text: 'Option 3',
        value: 'option 3',
      },
    ];

    const menuRef = {
      current: {
        openMenu: jest.fn(),
        closeMenu: jest.fn(),
        toggleMenu: jest.fn(),
      },
    };

    const user = userEvent.setup();

    render(
      <Combobox
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: '' })}
        groups={[]}
        options={options}
        menuId="menu"
        menuRef={menuRef}
        hasMoreInfo={false}
      />,
    );

    const combobox = screen.getByRole('combobox');
    combobox.focus();

    await user.keyboard('{ArrowUp}');
    expect(menuRef.current.openMenu).toHaveBeenCalledWith(
      options.length - 1,
      true,
    );
  });

  it(`opens the menu to the first option if no option is selected and the user 
  presses the Enter key while the combobox has focus.`, async () => {
    const options = [
      {
        text: 'Option 1',
        value: 'option 1',
      },
      {
        text: 'Option 2',
        value: 'option 2',
      },
      {
        text: 'Option 3',
        value: 'option 3',
      },
    ];

    const menuRef = {
      current: {
        openMenu: jest.fn(),
        closeMenu: jest.fn(),
        toggleMenu: jest.fn(),
      },
    };

    const user = userEvent.setup();

    render(
      <Combobox
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: '' })}
        groups={[]}
        options={options}
        menuId="menu"
        menuRef={menuRef}
        hasMoreInfo={false}
      />,
    );

    const combobox = screen.getByRole('combobox');
    combobox.focus();

    await user.keyboard('{Enter}');
    expect(menuRef.current.openMenu).toHaveBeenCalledWith(0, true);
  });

  it(`opens the menu to the selected option when an option has been selected and 
  the user presses the Enter key while the combobox has focus.`, async () => {
    const options = [
      {
        text: 'Option 1',
        value: 'option 1',
      },
      {
        text: 'Option 2',
        value: 'option 2',
      },
      {
        text: 'Option 3',
        value: 'option 3',
      },
    ];

    const menuRef = {
      current: {
        openMenu: jest.fn(),
        closeMenu: jest.fn(),
        toggleMenu: jest.fn(),
      },
    };

    const user = userEvent.setup();

    render(
      <Combobox
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: options[1].value })}
        groups={[]}
        options={options}
        menuId="menu"
        menuRef={menuRef}
        hasMoreInfo={false}
      />,
    );

    const combobox = screen.getByRole('combobox');
    combobox.focus();

    await user.keyboard('{Enter}');
    expect(menuRef.current.openMenu).toHaveBeenCalledWith(1, true);
  });

  it(`opens the menu to the index of the first option starting with a given 
  character when the user presses the corresponding key and the combobox has 
  focus.`, async () => {
    const options = ['A', 'B', 'C'];
    const menuRef = {
      current: {
        openMenu: jest.fn(),
        closeMenu: jest.fn(),
        toggleMenu: jest.fn(),
      },
    };

    const user = userEvent.setup();

    render(
      <Combobox
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: '' })}
        groups={[]}
        options={options.map(option => ({ text: option, value: option }))}
        menuId="menu"
        menuRef={menuRef}
        hasMoreInfo={false}
      />,
    );

    const combobox = screen.getByRole('combobox');
    combobox.focus();

    await user.keyboard('b');
    expect(menuRef.current.openMenu).toHaveBeenCalledWith(1, true);
  });

  it(`opens the menu to the currently selected option (or first if no option is 
  selected) when the user presses a printable character key but no option is 
  found beginning with that character.`, async () => {
    const field = new Field({ name: 'testField', defaultValue: '' });
    const options = ['A', 'B', 'C'];
    const menuRef = {
      current: {
        openMenu: jest.fn(),
        closeMenu: jest.fn(),
        toggleMenu: jest.fn(),
      },
    };

    const user = userEvent.setup();

    render(
      <Combobox
        label="Select an option"
        field={field}
        groups={[]}
        options={options.map(option => ({ text: option, value: option }))}
        menuId="menu"
        menuRef={menuRef}
        hasMoreInfo={false}
      />,
    );

    const combobox = screen.getByRole('combobox');
    combobox.focus();

    /* 
      Expect the menu to be opened to the first option since no option exists 
      that begins with 'z' and no option is selected.
    */
    await user.keyboard('z');
    expect(menuRef.current.openMenu).toHaveBeenCalledWith(0, true);

    /* 
      Expect the menu to be opened to the selected option since no option exists 
      that begins with 'z' and an option is selected.
    */
    act(() => field.setValue(options[1]));
    await user.keyboard('z');
    expect(menuRef.current.openMenu).toHaveBeenCalledWith(1, true);
  });

  it(`toggles the menu when the user clicks on the component, opening it to the 
  first option if none is selected.`, async () => {
    const menuRef = {
      current: {
        openMenu: jest.fn(),
        closeMenu: jest.fn(),
        toggleMenu: jest.fn(),
      },
    };

    const user = userEvent.setup();

    render(
      <Combobox
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: '' })}
        groups={[]}
        options={[
          {
            text: 'Option 1',
            value: 'option 1',
          },
          {
            text: 'Option 2',
            value: 'option 2',
          },
          {
            text: 'Option 3',
            value: 'option 3',
          },
        ]}
        menuId="menu"
        menuRef={menuRef}
        hasMoreInfo={false}
      />,
    );

    const outerContainer = document.getElementsByClassName('container')[0];

    await user.click(outerContainer);
    expect(menuRef.current.toggleMenu).toHaveBeenCalledWith(0, false);
  });

  it(`toggles the menu when the user clicks on the component, opening it to the 
  selected option if one is selected.`, async () => {
    const options = [
      {
        text: 'Option 1',
        value: 'option 1',
      },
      {
        text: 'Option 2',
        value: 'option 2',
      },
      {
        text: 'Option 3',
        value: 'option 3',
      },
    ];

    const menuRef = {
      current: {
        openMenu: jest.fn(),
        closeMenu: jest.fn(),
        toggleMenu: jest.fn(),
      },
    };

    const user = userEvent.setup();

    render(
      <Combobox
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: options[1].value })}
        groups={[]}
        options={options}
        menuId="menu"
        menuRef={menuRef}
        hasMoreInfo={false}
      />,
    );

    const outerContainer = document.getElementsByClassName('container')[0];

    await user.click(outerContainer);
    expect(menuRef.current.toggleMenu).toHaveBeenCalledWith(1, false);
  });

  it(`applies the class "container_with_more_info" to the outer container if 
  props.hasMoreInfo is true.`, () => {
    render(
      <Combobox
        label="Select an option"
        field={new Field({ name: 'testField', defaultValue: '' })}
        groups={[]}
        options={[]}
        menuId="menu"
        menuRef={{
          current: {
            openMenu: jest.fn(),
            closeMenu: jest.fn(),
            toggleMenu: jest.fn(),
          },
        }}
        hasMoreInfo={true}
      />,
    );

    expect(
      document.getElementsByClassName('container_with_more_info').length,
    ).toBe(1);
  });
});
