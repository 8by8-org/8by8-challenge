import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Returns a React state variable that counts down to zero from a given number
 * of seconds and a function that restarts the countdown.
 *
 * @param seconds - The number of seconds to count down from.
 * @returns A React state variable representing the seconds remaining in the
 * countdown and a function to restart the countdown.
 */
export function useCountdown(seconds: number) {
  const [countdown, setCountdown] = useState(seconds);
  const interval = useRef<ReturnType<typeof setInterval> | null>();

  const restartCountdown = () => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    setCountdown(seconds);

    let secondsLeft = seconds;

    interval.current = setInterval(() => {
      secondsLeft = Math.max(secondsLeft - 1, 0);

      if (secondsLeft === 0 && interval.current)
        clearInterval(interval.current);

      setCountdown(secondsLeft);
    }, 1000);
  };

  const startCountdown = useCallback(restartCountdown, [seconds]);

  useEffect(() => {
    startCountdown();

    return () => {
      /* istanbul ignore else */
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [startCountdown]);

  return { countdown, restartCountdown };
}
