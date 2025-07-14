import type { AnalyticsEventType } from './analytics-event-type';
import type { UserType } from '@/model/enums/user-type';

/**
 * Maps event types to expected parameters for that event.
 *
 * @remarks
 * To add a new custom event, a developer can add a new member to the
 * `AnalyticsEventType` enum, and if that event should receive parameters,
 * add that member to this object as a key whose value is an object containing
 * the parameters that the `sendAnalyticsEvent` function will expect for that
 * event. If no parameters are to be sent to analytics for the new event, this
 * object does not require modification.
 *
 * This ensures complete type safety when calling `sendAnalyticsEvent.`
 */
export interface EventParameters {
  [AnalyticsEventType.FormSubmit]: {
    /**
     * The `id` attribute of the form that the user attempted to submit.
     */
    formId: string;
    /**
     * Indicates whether or not the attempted form submission was successful.
     */
    succeeded: boolean;
    /**
     * The `name` attribute of the form that the user attempted to submit
     * (optional).
     */
    formName?: string;
    /**
     * If a form submission was not successful because the form contained
     * invalid fields, the names of these fields can be sent to Google Analytics
     * to facilitate better understanding of potential pain points.
     */
    invalidFields?: string[];
  };
  [AnalyticsEventType.SignUp]: {
    /**
     * The user's type upon registration. In practice, this will either be
     * `UserType.Challenger` or `UserType.Player`.
     */
    userType: UserType;
  };
  [AnalyticsEventType.ShareChallenge]: {
    /**
     * The user's type when completing this action.
     */
    userType: UserType;
    /**
     * If the user has not previously shared their challenge, this will be true.
     * This can be used to track the number of unique shares of the challenge.
     */
    firstShare: boolean;
  };
  [AnalyticsEventType.GetElectionReminders]: {
    /**
     * The user's type when completing this action.
     */
    userType: UserType;
  };
  [AnalyticsEventType.RegisterToVote]: {
    /**
     * The user's type when completing this action.
     */
    userType: UserType;
    /**
     * The US state in which the user lives. This can help us measure the
     * effectiveness of our efforts in each state.
     */
    USState: string;
  };
}
