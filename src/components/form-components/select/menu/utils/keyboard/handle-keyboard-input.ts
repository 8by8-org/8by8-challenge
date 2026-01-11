import { stopScrolling } from '../scroll';
import { focusOnOption } from '../focus';
import { closeMenuAndFocusOnCombobox } from '../menu-state';
import { isPrintableCharacterKey } from '../../../utils/is-printable-character-key';
import { findOptionIndexByFirstChar } from '../../../utils/find-option-index-by-first-letter';
import type { RefObject, MutableRefObject } from 'react';
import type { FieldOfType } from 'fully-formed';
import type { Option } from '../../../types/option';

interface HandleKeyboardNavigationParams {
  key: string;
  optionIndex: number;
  options: Option[];
  containerRef: RefObject<HTMLDivElement>;
  comboboxRef: RefObject<HTMLInputElement>;
  menuRef: RefObject<HTMLMenuElement>;
  scrollUpButtonRef: RefObject<HTMLButtonElement>;
  scrollDownButtonRef: RefObject<HTMLButtonElement>;
  scrollInterval: MutableRefObject<ReturnType<typeof setInterval> | undefined>;
  isKeyboardNavigating: MutableRefObject<boolean>;
  field: FieldOfType<string>;
}

/**
 * Handles keyboard input received while an option within the menu is in
 * focus.
 *
 * @param key - The key that was pressed.
 * @param optionIndex - The index of the option that received the keyboard
 * input.
 */
export function handleKeyboardInput({
  key,
  optionIndex,
  options,
  containerRef,
  comboboxRef,
  menuRef,
  scrollUpButtonRef,
  scrollDownButtonRef,
  scrollInterval,
  isKeyboardNavigating,
  field,
}: HandleKeyboardNavigationParams) {
  if (key === 'ArrowDown' && optionIndex < options.length - 1) {
    isKeyboardNavigating.current = true;

    stopScrolling(scrollInterval);

    focusOnOption({
      optionIndex: optionIndex + 1,
      optionCount: options.length,
      scrollUpButtonRef,
      scrollDownButtonRef,
      menuRef,
    });
  } else if (key === 'ArrowUp' && optionIndex > 0) {
    isKeyboardNavigating.current = true;

    stopScrolling(scrollInterval);

    focusOnOption({
      optionIndex: optionIndex - 1,
      optionCount: options.length,
      scrollUpButtonRef,
      scrollDownButtonRef,
      menuRef,
    });
  } else if (key === 'Enter' || key === 'Tab') {
    field.setValue(options[optionIndex].value);

    closeMenuAndFocusOnCombobox({
      comboboxRef,
      containerRef,
    });
  } else if (key === 'Escape') {
    closeMenuAndFocusOnCombobox({
      comboboxRef,
      containerRef,
    });
  } else if (isPrintableCharacterKey(key)) {
    isKeyboardNavigating.current = true;
    const indexOfOptionToReceiveFocus = findOptionIndexByFirstChar(
      options,
      key,
    );

    /* istanbul ignore else */
    if (indexOfOptionToReceiveFocus >= 0) {
      focusOnOption({
        optionIndex: indexOfOptionToReceiveFocus,
        optionCount: options.length,
        scrollUpButtonRef,
        scrollDownButtonRef,
        menuRef,
      });
    }
  }
}
