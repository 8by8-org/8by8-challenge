'use client';
import {
  forwardRef,
  useId,
  type ForwardedRef,
  type KeyboardEventHandler,
  type RefObject,
} from 'react';
import {
  Field,
  usePipe,
  useMultiPipe,
  useValue,
  ValidityUtils,
  type FieldOfType,
  type IGroup,
} from 'fully-formed';
import Image from 'next/image';
import { isPrintableCharacterKey } from '../utils/is-printable-character-key';
import { findOptionIndexByFirstChar } from '../utils/find-option-index-by-first-letter';
import caretDown from '../../../../../public/static/images/components/select/caret-down.svg';
import type { Option } from '../types/option';
import type { MenuRef } from '../menu';
import styles from './styles.module.scss';

interface ComboboxProps {
  /**
   * The label to be displayed when no option is selected. The `aria-label`
   * attribute of the combobox is also set to this value.
   */
  label: string;

  /**
   * A Fully Formed {@link Field} that will control the state of the combobox.
   */
  field: FieldOfType<string>;

  /**
   * An array of {@link IGroup}s. The validity of each group included
   * in this array will count towards the displayed validity of the combobox.
   */
  groups: IGroup[];

  /**
   * An array of {@link Option}s to be rendered within the menu of the parent
   * `Select` component.
   */
  options: Option[];

  /**
   * The id of the menu rendered by the parent `Select` component.
   */
  menuId: string;

  /**
   * A {@link RefObject} received from the parent `Select` component which
   * provides functions for opening, closing, and toggling the menu.
   */
  menuRef: RefObject<MenuRef>;

  /**
   * A flag indicating whether or not a `MoreInfo` button will be displayed by
   * the parent `Select` component. If true, the maximum width of the combobox
   * will be less than the full width of the `Select` in order to accomodate
   * this button.
   */
  hasMoreInfo: boolean;
  ['aria-required']?: boolean;
  ['aria-describedby']?: string;
}

/**
 * Renders an input with its `role` attribute set to "combobox." Its value and
 * validity are controlled by the state of a {@link Field}.
 *
 * @remarks
 * In addition to implementing click-based navigation, the component
 * implements the following keyboard navigation controls:
 * - `Enter` - opens the menu and focuses on the currently selected option, or
 *   the first option if no option is selected.
 * - `ArrowDown` - opens the menu and focuses on the first option.
 * - `ArrowUp` - opens the menu and focuses on the last option.
 * - Printable characters - opens the menu and focuses on the first option
 *   that starts with that character.
 */
export const Combobox = forwardRef(function Combobox(
  props: ComboboxProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const displayValue = usePipe(props.field, ({ value }) => {
    const option = props.options.find(option => option.value === value);

    if (option) {
      return option.text;
    } else {
      return value;
    }
  });

  const comboboxClassName = useMultiPipe(
    [props.field, ...props.groups],
    states => {
      const fieldState = states[0];
      const classNames = [styles.combobox];

      const validity = ValidityUtils.minValidity(states, {
        pruneUnvalidatedGroups: true,
      });

      if (
        fieldState.hasBeenModified ||
        fieldState.hasBeenBlurred ||
        fieldState.submitted
      ) {
        if (ValidityUtils.isCaution(validity)) {
          classNames.push(styles.caution);
        } else if (ValidityUtils.isInvalid(validity)) {
          classNames.push(styles.invalid);
        }
      }

      return classNames.join(' ');
    },
  );

  const ariaInvalid = useMultiPipe([props.field, ...props.groups], states => {
    const validity = ValidityUtils.minValidity(states);
    const fieldState = states[0];

    return (
      ValidityUtils.isInvalid(validity) &&
      (fieldState.hasBeenModified ||
        fieldState.hasBeenBlurred ||
        fieldState.submitted)
    );
  });

  const warningMessage = useMultiPipe(
    [props.field, ...props.groups],
    states => {
      const validity = ValidityUtils.minValidity(states);
      const fieldState = states[0];

      return (
          ValidityUtils.isCaution(validity) &&
            (fieldState.hasBeenModified ||
              fieldState.hasBeenBlurred ||
              fieldState.submitted)
        ) ?
          'The value of this field could not be confirmed. Please verify that it is correct.'
        : undefined;
    },
  );

  const warningMessageId = useId();

  const handleKeyboardInput: KeyboardEventHandler = event => {
    const { key } = event;
    const controlKeys = ['ArrowDown', 'ArrowUp', 'Enter'];

    /* 
      Prevent default behavior (such as scrolling) ONLY when key is a control 
      key or a printable character, preserving default behavior for keys like
      tab.
    */
    /* istanbul ignore else */
    if (controlKeys.includes(key) || isPrintableCharacterKey(key)) {
      event.preventDefault();
    }

    // prettier-ignore
    if (key === 'ArrowDown') {
      openMenuToFirstWithKeyboard();
    } else if (key === 'ArrowUp') {
      openMenuToLastWithKeyboard();
    } else if (key === 'Enter') {
      openMenuToSelectedOrFirstWithKeyboard();
    } else /* istanbul ignore else */ if (isPrintableCharacterKey(key)) {
      openMenuWithAutoComplete(key);
    }
  };

  function toggleMenuOnClick() {
    let indexOfOptionToReceiveFocus = getSelectedOptionIndex();

    if (indexOfOptionToReceiveFocus === -1) {
      indexOfOptionToReceiveFocus = 0;
    }

    props.menuRef.current?.toggleMenu(indexOfOptionToReceiveFocus, false);
  }

  function openMenuToFirstWithKeyboard() {
    props.menuRef.current?.openMenu(0, true);
  }

  function openMenuToLastWithKeyboard() {
    props.menuRef.current?.openMenu(props.options.length - 1, true);
  }

  function openMenuToSelectedOrFirstWithKeyboard() {
    let indexOfOptionToReceiveFocus = getSelectedOptionIndex();

    if (indexOfOptionToReceiveFocus === -1) {
      indexOfOptionToReceiveFocus = 0;
    }

    props.menuRef.current?.openMenu(indexOfOptionToReceiveFocus, true);
  }

  function openMenuWithAutoComplete(key: string) {
    const indexOfOptionToReceiveFocus = findOptionIndexByFirstChar(
      props.options,
      key,
    );

    if (indexOfOptionToReceiveFocus >= 0) {
      props.menuRef.current?.openMenu(indexOfOptionToReceiveFocus, true);
    } else {
      openMenuToSelectedOrFirstWithKeyboard();
    }
  }

  function getSelectedOptionIndex() {
    return props.options.findIndex(option => {
      return option.value === props.field.state.value;
    });
  }

  return (
    <div
      className={
        props.hasMoreInfo ? styles.container_with_more_info : styles.container
      }
      onClick={toggleMenuOnClick}
    >
      <span aria-hidden className={comboboxClassName}>
        <span className={styles.selection}>
          {displayValue ? displayValue : props.label}
        </span>
        <Image src={caretDown} alt="" />
      </span>
      <input
        name={props.field.name}
        id={props.field.id}
        ref={ref}
        role="combobox"
        aria-controls={props.menuId}
        aria-expanded={false}
        aria-label={props.label}
        aria-describedby={
          props['aria-describedby'] ?
            `${props['aria-describedby']} ${warningMessageId}`
          : warningMessageId
        }
        aria-invalid={ariaInvalid}
        aria-required={props['aria-required']}
        type="text"
        value={useValue(props.field)}
        onKeyDown={handleKeyboardInput}
        className={styles.input}
        autoComplete="off"
        readOnly
      />
      <span
        style={{ position: 'fixed', visibility: 'hidden' }}
        id={warningMessageId}
      >
        {warningMessage}
      </span>
    </div>
  );
});
