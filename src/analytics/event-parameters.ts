import type { AnalyticsEventType } from './analytics-event-type';
import type { UserType } from '@/model/enums/user-type';

/**
 * Maps event types to expected parameters for that event.
 *
 * @remarks
 * To add a new custom event, a developer can add a new member
 * to the `AnalyticsEventType` enum, and if that event should
 * receive parameters, add that member to this object as a key
 * whose value is an object containing the parameters that
 * the `sendAnalyticsEvent` function will expect for that
 * event. If no parameters are to be sent to analytics for
 * the new event, this object does not require modification.
 *
 * This ensures complete type safety when calling
 * `sendAnalyticsEvent.`
 */
export interface EventParameters {
  [AnalyticsEventType.FormSubmit]: {
    succeeded: boolean;
    formId: string;
    formName?: string;
    invalidFields?: string[];
  };
  [AnalyticsEventType.SignUp]: {
    userType: UserType;
  };
  [AnalyticsEventType.ShareChallenge]: {
    userType: UserType;
    firstShare: boolean;
  };
  [AnalyticsEventType.GetElectionReminders]: {
    userType: UserType;
  };
  [AnalyticsEventType.RegisterToVote]: {
    userType: UserType;
    USState: string;
  };
}
