import { sendGAEvent } from '@next/third-parties/google';
import { EventType } from './event-type';
import type { EventParameters } from './event-parameters';

export function sendAnalyticsEvent<T extends EventType>(
  ...args: T extends keyof EventParameters ?
    [eventType: T, parameters: EventParameters[T]]
  : [eventType: T]
): void {
  sendGAEvent('event', ...args);
}
