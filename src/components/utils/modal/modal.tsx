'use client';
import { useRef, useEffect, type ReactNode } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import styles from './styles.module.scss';

type ModalProps = {
  ariaLabel: string;
  theme: 'dark' | 'light';
  isOpen: boolean;
  closeModal: () => void;
  children?: ReactNode;
};

export function Modal({
  ariaLabel,
  theme,
  isOpen,
  closeModal,
  children,
}: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (isOpen) {
      /* istanbul ignore else */
      if (dialog.current && !dialog.current.hasAttribute('open')) {
        dialog.current.showModal();
        dialog.current.focus();
      }
    } else {
      dialog.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      aria-label={ariaLabel}
      role="dialog"
      className={styles[`modal_${theme}_theme`]}
      ref={dialog}
      onKeyDown={event => {
        /* istanbul ignore else */
        if (event.key === 'Escape') {
          event.preventDefault();
          closeModal();
        }
      }}
    >
      <div>
        <div className={styles.close_btn_container}>
          <button
            className={styles.close_btn}
            aria-label="close dialog"
            onClick={closeModal}
            type="button"
          >
            <AiOutlineClose className={styles.close_btn_icon} />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </dialog>
  );
}
