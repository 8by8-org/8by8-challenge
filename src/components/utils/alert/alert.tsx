'use client';
import {
  forwardRef,
  useRef,
  useImperativeHandle,
  type ForwardedRef,
} from 'react';
import styles from './styles.module.scss';

/**
 * The instance value returned to parents by the `Alert` component when using
 * `ref`. The value is a function that the parent can call to retrigger the
 * alert animation.
 */
export type AlertRefType = (
  message: string,
  variant: 'error' | 'success',
) => void;

/**
 * An alert that can be displayed at the top of the page to provide feedback to
 * users when an asynchronous operation succeeds or fails. The alert will
 * automatically disappear after a given amount of time.
 *
 * @remarks
 * Rather than adding this component directly to a page, use the `showAlert`
 * method provided by the `AlertsContext`.
 *
 * @example
 * ```
 * // with AlertsContext (preferred)
 * import { AlertsContext } from '@/contexts/alerts-context';
 * import { useContextSafely } from '@/hooks/use-context-safely';
 *
 * export function MyComponent() {
 *   const { showAlert } = useContextSafely(AlertsContext, 'MyComponent');
 *
 *   const myAsyncFunction () => {
 *     try {
 *       // attempt some async operation that can fail
 *       // if it succeeds, show a success alert
 *       showAlert('Operation succeeded!', 'success');
 *     } catch(e) {
 *       // otherwise, show an error message
 *       showAlert('Operation encountered an error.', 'error');
 *     }
 *   }
 *
 *   return (
 *     <button onClick={myAsyncFunction}>Click me</button>
 *   )
 * }
 *
 * ```
 *
 * @example
 * ```
 * // using this component directly
 * import { Alert, useAlert } from '@/components/utils/alert';
 *
 * export function MyComponent() {
 *   const { alertRef, showAlert } = useAlert();
 *
 *   const myAsyncFunction () => {
 *     try {
 *       // attempt some async operation that can fail
 *       // if it succeeds, show a success alert
 *       showAlert('Operation succeeded!', 'success');
 *     } catch(e) {
 *       // otherwise, show an error message
 *       showAlert('Operation encountered an error.', 'error');
 *     }
 *   }
 *
 *   return (
 *     <>
 *       <Alert ref={alertRef} />
 *       <button onClick={myAsyncFunction}>Click me</button>
 *     </>
 *   )
 * }
 * ```
 */
export const Alert = forwardRef(function Alert(
  _props: {},
  ref: ForwardedRef<AlertRefType>,
) {
  const alertRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => {
    return (message: string, variant: 'error' | 'success') => {
      /* istanbul ignore else */
      if (alertRef.current) {
        const alert = alertRef.current;
        /*
          Clear the current content of the alert so that the message is always 
          read by the screen reader.
        */
        alert.textContent = '';
        alert.textContent = message;
        alert.className = styles[variant];

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            alert.className = `${styles[variant]} ${styles.slide_out}`;
          });
        });
      }
    };
  });

  return (
    <div className={styles.alert_container}>
      <div ref={alertRef} className={styles.hidden} role="alert"></div>
    </div>
  );
});
