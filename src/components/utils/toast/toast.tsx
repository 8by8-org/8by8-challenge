'use client';
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  type ForwardedRef,
  type CSSProperties,
} from 'react';
import { joinClassNames } from '@/utils/client/join-classnames';
import styles from './styles.module.scss';

/**
 * The instance value returned to parents by the `Toast` component when using
 * `ref`. The value is a function that the parent can call to retrigger the
 * toast animation.
 */
export type ToastRefType = (message: string) => void;

interface ToastProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * A toast that can be displayed to provide feedback to the user that some
 * action has taken place, for instance, copying a link. The toast will
 * automatically disappear after a short time.
 *
 * @example
 * ```
 * import { Toast, useToast } from '@/components/utils/toast';
 *
 * export function MyComponent() {
 *   const { toastRef, showToast } = useToast();
 *
 *   const copyLink = () => {
 *     navigator.clipboard.writeText('https://challenge.8by8.us');
 *     showToast('Copied link!');
 *   }
 *
 *   return (
 *     <>
 *       <button onClick={copyLink}>Copy link</button>
 *       <Toast ref={toastRef} />
 *     </>
 *   )
 * }
 * ```
 */
export const Toast = forwardRef(function Toast(
  props: ToastProps,
  ref: ForwardedRef<ToastRefType>,
) {
  const toastRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return (message: string) => {
      /* istanbul ignore else */
      if (toastRef.current) {
        const toast = toastRef.current;
        /*
          Clear the current content of the toast so that the alert is always 
          read by the screen reader.
        */
        toast.textContent = '';
        toast.textContent = message;
        toast.classList.remove(styles.hidden);
        toast.animate(
          [
            {
              display: 'block',
              opacity: 0,
              offset: 0,
            },
            {
              opacity: 1,
              offset: 0.08, // approximately 300ms
            },
            {
              opacity: 1,
              offset: 0.92,
            },
            {
              display: 'none',
              opacity: 0,
              offset: 1,
            },
          ],
          {
            duration: 3600,
            fill: 'forwards',
            iterations: 1,
          },
        );
      }
    };
  });

  return (
    <div
      ref={toastRef}
      className={joinClassNames(styles.hidden, styles.toast, props.className)}
      style={props.style}
      role="alert"
    ></div>
  );
});
