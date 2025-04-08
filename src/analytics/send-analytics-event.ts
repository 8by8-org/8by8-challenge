import { sendGAEvent } from '@next/third-parties/google';
import { AnalyticsEventType } from './analytics-event-type';
import type { EventParameters } from './event-parameters';

/**
 * Logs an event to analytics.
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
 * Translates event parameters object properties from
 * camelCase (compliant with the 8by8 style guide) into
 * snake_case (to match other event parameters in Google Analytics).
 *
 * @param eventType
 * @param params
 * @returns
 */
function formatParams<T extends AnalyticsEventType>(
  eventType: T,
  params: T extends keyof EventParameters ? EventParameters[T] : undefined,
) {
  const formattedParams: Record<string, unknown> = {};

  switch (eventType) {
    case AnalyticsEventType.FormSubmit:
      const formSubmitParams =
        params as EventParameters[AnalyticsEventType.FormSubmit];
      formattedParams.form_id = formSubmitParams.formId;
      formattedParams.form_name = formSubmitParams.formName;
      formattedParams.succeeded = formSubmitParams.succeeded;
      formattedParams.invalid_fields = formSubmitParams.invalidFields;
      break;
    case AnalyticsEventType.SignUp:
      const signUpParams = params as EventParameters[AnalyticsEventType.SignUp];
      formattedParams.user_type = signUpParams.userType;
      break;
    case AnalyticsEventType.ShareChallenge:
      const shareChallengeParams =
        params as EventParameters[AnalyticsEventType.ShareChallenge];
      formattedParams.user_type = shareChallengeParams.userType;
      formattedParams.first_share = shareChallengeParams.firstShare;
      break;
    case AnalyticsEventType.GetElectionReminders:
      const remindersParams =
        params as EventParameters[AnalyticsEventType.GetElectionReminders];
      formattedParams.user_type = remindersParams.userType;
      break;
    case AnalyticsEventType.RegisterToVote:
      const registrationParams =
        params as EventParameters[AnalyticsEventType.RegisterToVote];
      formattedParams.user_type = registrationParams.userType;
      formattedParams.us_state = registrationParams.USState;
      break;
  }

  return formattedParams;
}
