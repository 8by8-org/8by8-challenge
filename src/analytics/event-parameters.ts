import type { AnalyticsEventType } from './analytics-event-type';
import type { UserType } from '@/model/enums/user-type';

/**
 * Maps event types to expected parameters for that event.
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
