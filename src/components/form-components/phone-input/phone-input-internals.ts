import { replaceStringSegment } from '@/utils/shared/replace-string-segment';
import type { FieldOfType } from 'fully-formed';
import type { MutableRefObject, KeyboardEvent, ChangeEvent } from 'react';

export class PhoneInputInternals {
  private static readonly PHONE_NUMBER_LENGTH = 10;
  private static readonly ArrowKeys = {
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
  };

  public static formatPhoneNumber(unformattedPhoneNumber: string) {
    if (unformattedPhoneNumber.length >= 7) {
      return `(${unformattedPhoneNumber.slice(0, 3)}) ${unformattedPhoneNumber.slice(3, 6)}-${unformattedPhoneNumber.slice(6)}`;
    }

    if (unformattedPhoneNumber.length >= 4) {
      return `(${unformattedPhoneNumber.slice(0, 3)}) ${unformattedPhoneNumber.slice(3)}`;
    }

    return unformattedPhoneNumber;
  }

  public static handleKeyDown(event: KeyboardEvent) {
    const { key } = event;
    if (key === this.ArrowKeys.LEFT || key === this.ArrowKeys.RIGHT) {
      event.preventDefault();
      key === this.ArrowKeys.LEFT ?
        this.handleLeftArrow(event)
      : this.handleRightArrow(event);
    }
  }

  public static handleAutoComplete(
    event: ChangeEvent<HTMLInputElement>,
    field: FieldOfType<string>,
  ) {
    field.setValue(
      event.target.value
        .split('')
        .filter(c => /\d/.test(c))
        .join(''),
    );
  }

  public static handleBeforeInput(
    event: InputEvent,
    field: FieldOfType<string>,
    cursorPositionRef: MutableRefObject<number | null>,
  ) {
    /* istanbul ignore else */
    if (
      event.data ||
      event.inputType === 'deleteContentBackward' ||
      event.inputType === 'deleteContentForward'
    ) {
      event.preventDefault();
    }

    // prettier-ignore
    if (event.data) {
      this.handleDataInput(event, field, cursorPositionRef);
    } else if (event.inputType === 'deleteContentBackward') {
      this.handleBackwardsDelete(event, field, cursorPositionRef);
    } else /* istanbul ignore else */ if (event.inputType === 'deleteContentForward') {
      this.handleForwardsDelete(event, field, cursorPositionRef);
    }
  }

  private static handleLeftArrow(event: KeyboardEvent) {
    this.moveCursor(event);
  }

  private static handleRightArrow(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    if (target.selectionStart === target.value.length) return;
    this.moveCursor(event);
  }

  private static moveCursor(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const { key } = event;

    let unformattedSelectionStart =
      this.formattedSelectionPositionToUnformatted(
        target.selectionStart!,
        target.value.length,
      );

    unformattedSelectionStart =
      key === this.ArrowKeys.LEFT ?
        unformattedSelectionStart - 1
      : unformattedSelectionStart + 1;

    const newSelectionStart = this.unformattedSelectionPositionToFormatted(
      unformattedSelectionStart,
      target.value.split('').filter(c => {
        return this.isDigit(c);
      }).length,
    );

    target.setSelectionRange(newSelectionStart, newSelectionStart);
  }

  private static handleDataInput(
    event: InputEvent,
    field: FieldOfType<string>,
    cursorPositionRef: MutableRefObject<number | null>,
  ) {
    const target = event.target as HTMLInputElement;
    const selectionStart = target.selectionStart!;
    const selectionEnd = target.selectionEnd!;
    const input = event.data!;
    const currentUnformattedValue = field.state.value;

    const unformattedSelectionStart =
      this.formattedSelectionPositionToUnformatted(
        selectionStart,
        target.value.length,
      );

    const unformattedSelectionEnd =
      this.formattedSelectionPositionToUnformatted(
        selectionEnd,
        target.value.length,
      );

    const filteredAndTruncatedInput = this.filterAndTruncateInput(
      input,
      currentUnformattedValue,
      unformattedSelectionStart,
      unformattedSelectionEnd,
    );

    const updatedValue = replaceStringSegment(
      currentUnformattedValue,
      filteredAndTruncatedInput,
      unformattedSelectionStart,
      unformattedSelectionEnd,
    );

    if (updatedValue !== currentUnformattedValue) {
      cursorPositionRef.current = this.unformattedSelectionPositionToFormatted(
        unformattedSelectionStart + filteredAndTruncatedInput.length,
        updatedValue.length,
      );

      field.setValue(updatedValue);
    } else {
      target.setSelectionRange(selectionEnd, selectionEnd);
    }
  }

  private static handleBackwardsDelete(
    event: InputEvent,
    field: FieldOfType<string>,
    cursorPositionRef: MutableRefObject<number | null>,
  ) {
    const target = event.target as HTMLInputElement;
    const formattedSelectionStart = target.selectionStart!;
    const formattedSelectionEnd = target.selectionEnd!;
    const { value } = target;

    const formattedSelectionLength =
      formattedSelectionEnd - formattedSelectionStart;

    if (
      this.isOnlyPunctuationHighlighted(
        target.value,
        formattedSelectionStart,
        formattedSelectionEnd,
      )
    )
      return;

    let unformattedSelectionStart =
      this.formattedSelectionPositionToUnformatted(
        formattedSelectionStart,
        value.length,
      );

    if (formattedSelectionLength === 0) {
      unformattedSelectionStart = Math.max(unformattedSelectionStart - 1, 0);
    }

    const unformattedSelectionEnd =
      this.formattedSelectionPositionToUnformatted(
        formattedSelectionEnd,
        value.length,
      );

    const updatedValue = replaceStringSegment(
      field.state.value,
      '',
      unformattedSelectionStart,
      unformattedSelectionEnd,
    );

    cursorPositionRef.current = this.unformattedSelectionPositionToFormatted(
      unformattedSelectionStart,
      updatedValue.length,
    );

    field.setValue(updatedValue);
  }

  private static handleForwardsDelete(
    event: InputEvent,
    field: FieldOfType<string>,
    cursorPositionRef: MutableRefObject<number | null>,
  ) {
    const target = event.target as HTMLInputElement;
    const formattedSelectionStart = target.selectionStart!;
    const formattedSelectionEnd = target.selectionEnd!;
    const { value } = target;

    const formattedSelectionLength =
      formattedSelectionEnd - formattedSelectionStart;

    if (
      this.isOnlyPunctuationHighlighted(
        target.value,
        formattedSelectionStart,
        formattedSelectionEnd,
      )
    )
      return;

    const unformattedSelectionStart =
      this.formattedSelectionPositionToUnformatted(
        formattedSelectionStart,
        value.length,
      );

    let unformattedSelectionEnd = this.formattedSelectionPositionToUnformatted(
      formattedSelectionEnd,
      value.length,
    );

    /* istanbul ignore else */
    if (formattedSelectionLength === 0) {
      unformattedSelectionEnd = Math.min(
        unformattedSelectionEnd + 1,
        this.PHONE_NUMBER_LENGTH,
      );
    }

    const updatedValue = replaceStringSegment(
      field.state.value,
      '',
      unformattedSelectionStart,
      unformattedSelectionEnd,
    );

    cursorPositionRef.current = this.unformattedSelectionPositionToFormatted(
      unformattedSelectionStart,
      updatedValue.length,
    );

    field.setValue(updatedValue);
  }

  private static formattedSelectionPositionToUnformatted(
    formattedSelectionPosition: number,
    formattedLength: number,
  ) {
    if (formattedLength <= 3) return formattedSelectionPosition;

    const positionMap = [0, 0, 1, 2, 3, 3, 3, 4, 5, 6, 6, 7, 8, 9, 10];
    return positionMap[formattedSelectionPosition];
  }

  private static unformattedSelectionPositionToFormatted(
    unformattedSelectionPosition: number,
    unformattedLength: number,
  ) {
    if (unformattedLength <= 3) return unformattedSelectionPosition;

    const positionMap = [1, 2, 3, 4, 7, 8, 9, 11, 12, 13, 14];
    return positionMap[unformattedSelectionPosition];
  }

  private static filterAndTruncateInput(
    input: string,
    fieldValue: string,
    unformattedSelectionStart: number,
    unformattedSelectionEnd: number,
  ) {
    const unformattedSelectionLength =
      unformattedSelectionEnd - unformattedSelectionStart;

    const availableDigits =
      this.PHONE_NUMBER_LENGTH -
      (fieldValue.length - unformattedSelectionLength);

    const filteredAndTruncatedInput = this.toDigits(input).slice(
      0,
      availableDigits,
    );

    return filteredAndTruncatedInput;
  }

  private static toDigits(str: string) {
    return str
      .split('')
      .filter(c => this.isDigit(c))
      .join('');
  }

  private static isDigit(c: string) {
    return /^\d$/.test(c);
  }

  private static isOnlyPunctuationHighlighted(
    formattedValue: string,
    formattedSelectionStart: number,
    formattedSelectionEnd: number,
  ) {
    const selection = formattedValue.slice(
      formattedSelectionStart,
      formattedSelectionEnd,
    );
    return selection.match(/^\)\s$|^[(\s)-]$/);
  }
}
