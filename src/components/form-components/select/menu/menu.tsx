'use client';
import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  type ForwardedRef,
  type RefObject,
} from 'react';
import Image from 'next/image';
import { useValue, type FieldOfType } from 'fully-formed';
import { useMenu } from './hooks/use-menu';
import { hasTouchPointExitedButton } from './utils';
import caretDown from '@/../public/static/images/components/select/caret-down.svg';
import caretUp from '@/../public/static/images/components/select/caret-up.svg';
import type { Option } from '../types/option';
import styles from './styles.module.scss';

export interface MenuProps {
  /**
   * A {@link Field} whose value can be set by the menu.
   */
  field: FieldOfType<string>;

  /**
   * An array of options to be displayed within the menu.
   */
  options: Option[];

  /**
   * A {@link RefObject} received from the parent `Select` component. The
   * `Select` component also passes this ref into a `Combobox` element, where it
   * is assigned to an element with the `combobox` role. The `Menu` component
   * may transfer focus to this element when it is closed.
   */
  comboboxRef: RefObject<HTMLInputElement>;
  id: string;
}

/**
 * A {@link RefObject} that exposes methods for opening, closing and toggling
 * the {@link Menu} component from outside.
 */
export interface MenuRef {
  openMenu: (
    indexOfOptionToReceiveFocus: number,
    openWithKeyboard: boolean,
  ) => void;
  closeMenu: () => void;
  toggleMenu: (
    indexOfOptionToReceiveFocus: number,
    openWithKeyboard: boolean,
  ) => void;
}

/**
 * A menu for the `Select` component. Exposes functions that can be called from
 * outside the menu to open it to a specific option, close it, and toggle it
 * (opening it to a specific option if currently closed).
 */
export const Menu = forwardRef(function Menu(
  props: MenuProps,
  ref: ForwardedRef<MenuRef>,
) {
  const fieldValue = useValue(props.field);
  const menuControls = useMenu({
    options: props.options,
    comboboxRef: props.comboboxRef,
    field: props.field,
  });

  useImperativeHandle(ref, () => {
    return {
      openMenu: menuControls.openMenu,
      closeMenu: menuControls.closeMenu,
      toggleMenu: menuControls.toggleMenu,
    };
  }, [menuControls.closeMenu, menuControls.openMenu, menuControls.toggleMenu]);

  useEffect(() => {
    const handleMouseMovement = () => {
      menuControls.isKeyboardNavigating.current = false;
    };

    const handleResize = () => {
      if (menuControls.isMenuScrollable()) {
        if (menuControls.isMenuScrolledToTop()) {
          menuControls.setScrollPosition('top');
        } else if (menuControls.isMenuScrolledToBottom()) {
          menuControls.setScrollPosition('bottom');
        } else {
          menuControls.setScrollPosition('middle');
        }
      } else {
        menuControls.setScrollPosition('noscroll');
      }
    };

    const handleScroll = () => {
      /* istanbul ignore else */
      if (menuControls.isMenuScrollable()) {
        if (menuControls.isMenuScrolledToTop()) {
          menuControls.setScrollPosition('top');
        } else if (menuControls.isMenuScrolledToBottom()) {
          menuControls.setScrollPosition('bottom');
        } else {
          menuControls.setScrollPosition('middle');
        }
      }
    };

    document.addEventListener('mousemove', handleMouseMovement);
    window.addEventListener('resize', handleResize);
    menuControls.menuRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMovement);
      window.removeEventListener('resize', handleResize);
    };
  }, [menuControls]);

  return (
    <div
      ref={menuControls.containerRef}
      className={`${styles.menu_container} hidden`}
    >
      {(menuControls.scrollPosition === 'middle' ||
        menuControls.scrollPosition === 'bottom') && (
        <button
          ref={menuControls.scrollUpButtonRef}
          type="button"
          className={styles.scroll_up}
          onMouseEnter={() => {
            /*
              If the user has opened the menu with the keyboard or is cycling 
              through the options with the arrow keys, the mouse can enter the 
              button when the content of the menu scrolls. This can cause 
              unexpected behavior, so return without calling startScrollingUp if 
              the user is navigating the menu with the keyboard.
            */
            if (menuControls.isKeyboardNavigating.current) {
              return;
            }

            menuControls.startScrollingUp();
          }}
          onMouseLeave={() => {
            menuControls.stopScrolling();
          }}
          onMouseDown={() => {
            menuControls.startScrollingUp();
          }}
          onMouseUp={() => {
            menuControls.stopScrolling();
          }}
          onTouchStart={() => {
            menuControls.startScrollingUp();
          }}
          onTouchEnd={() => {
            menuControls.stopScrolling();
          }}
          onTouchCancel={() => {
            menuControls.stopScrolling();
          }}
          onTouchMove={({ touches }) => {
            const touchPoint = touches[0];

            if (
              hasTouchPointExitedButton(
                touchPoint,
                menuControls.scrollUpButtonRef,
              )
            ) {
              menuControls.stopScrolling();
            }
          }}
        >
          <Image src={caretUp} alt="Scroll up" />
        </button>
      )}
      <menu
        role="listbox"
        id={props.id}
        ref={menuControls.menuRef}
        className={styles.menu}
      >
        {props.options.map((option, index) => {
          return (
            <li
              key={index}
              onMouseOver={({ target }) => {
                if (menuControls.isKeyboardNavigating.current) {
                  return;
                }

                (target as HTMLElement).focus({ preventScroll: true });
              }}
              className={styles.option}
              tabIndex={-1}
              role="option"
              aria-selected={option.value === fieldValue}
              onKeyDown={event => {
                event.preventDefault();
                menuControls.handleKeyboardInput(event.key, index);
              }}
              onClick={() => {
                props.field.setValue(option.value);
                menuControls.closeMenuAndFocusOnCombobox();
              }}
            >
              {option.text}
            </li>
          );
        })}
      </menu>
      {(menuControls.scrollPosition === 'top' ||
        menuControls.scrollPosition === 'middle') && (
        <button
          ref={menuControls.scrollDownButtonRef}
          type="button"
          className={styles.scroll_down}
          onMouseEnter={() => {
            /*
              If the user has opened the menu with the keyboard or is cycling 
              through the options with the arrow keys, the mouse can enter the 
              button when the content of the menu scrolls. This can cause 
              unexpected behavior, so return without calling startScrollingDown
              if the user is navigating the menu with the keyboard.
            */
            if (menuControls.isKeyboardNavigating.current) {
              return;
            }

            menuControls.startScrollingDown();
          }}
          onMouseLeave={() => {
            menuControls.stopScrolling();
          }}
          onMouseDown={() => {
            menuControls.startScrollingDown();
          }}
          onMouseUp={() => {
            menuControls.stopScrolling();
          }}
          onTouchStart={() => {
            menuControls.startScrollingDown();
          }}
          onTouchEnd={() => {
            menuControls.stopScrolling();
          }}
          onTouchCancel={() => {
            menuControls.stopScrolling();
          }}
          onTouchMove={({ touches }) => {
            const touchPoint = touches[0];

            if (
              hasTouchPointExitedButton(
                touchPoint,
                menuControls.scrollDownButtonRef,
              )
            ) {
              menuControls.stopScrolling();
            }
          }}
        >
          <Image src={caretDown} alt="Scroll down" />
        </button>
      )}
    </div>
  );
});
