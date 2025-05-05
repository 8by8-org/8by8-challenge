import { sendGAEvent } from '@next/third-parties/google';
import { AnalyticsEventType } from './analytics-event-type';
import { camelCaseToSnakeCase } from '@/utils/shared/camel-case-to-snake-case';
import type { EventParameters } from './event-parameters';

/**
 * Logs an event to analytics.
 *
 * @remarks
 * The arguments sent to analytics correspond to the `AnalyticsEventType` member
 * provided as the first argument. For instance, the following invocations will
 * FAIL to compile and will display warnings in the IDE:
 *
 * ```
 * // Too few arguments
 * sendAnalyticsEvent();
 *
 * // First argument is not a member of AnalyticsEventType
 * sendAnalyticsEvent('not_a_real_event');
 *
 * // Expects second argument
 * sendAnalyticsEvent(AnalyticsEventType.FormSubmit)
 *
 * // Expects only one argument
 * sendAnalyticsEvent(AnalyticsEventType.SignIn, {});
 *
 * // Second argument is missing keys
 * sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {});
 *
 * // Second argument's entries are not of the right type(s)
 * sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
 *   formId: 1, // a string is expected
 *   succeeded: null // a boolean is expected
 * });
 *
 * // Second argument has unexpected entries
 * sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
 *   formId: 'my-form',
 *   succeeded: true,
 *   oopsAnExtraKey: ''
 * });
 * ```
 *
 * To add events:
 * 1. Add a member to the `AnalyticsEventType` enum.
 * 2. If the event should take parameters, add an entry to `EventParameters`.
 * 3. Optionally, update the switch statement in `formatParams` to format those
 * parameters for Google Analytics. For example, this is necessary to convert
 * `USState` to `us_state` instead of `u_s_state`.
 */
export function sendAnalyticsEvent<T extends AnalyticsEventType>(
  ...args: T extends keyof EventParameters ?
    [eventType: T, parameters: EventParameters[T]]
  : [eventType: T]
): void {
  const eventType = args[0];
  const params = args[1];
  const formattedParams = formatParams(eventType, params);

  sendGAEvent('event', eventType, formattedParams);
}

/**
 * Translates event parameters object properties from camelCase (compliant with
 * the 8by8 style guide) into snake_case (to match other event parameters in
 * Google Analytics).
 */
function formatParams<T extends AnalyticsEventType>(
  eventType: T,
  params: T extends keyof EventParameters ? EventParameters[T] : undefined,
) {
  const formattedParams: Record<string, unknown> = {};

  switch (eventType) {
    case AnalyticsEventType.RegisterToVote:
      const registrationParams =
        params as EventParameters[AnalyticsEventType.RegisterToVote];
      formattedParams.user_type = registrationParams.userType;
      formattedParams.us_state = registrationParams.USState;
      break;
    default:
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          formattedParams[camelCaseToSnakeCase(key)] = value;
        }
      }
      break;
  }

  return formattedParams;
}
