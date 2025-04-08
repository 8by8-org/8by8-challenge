import type { EventType } from './event-type';
import type { UserType } from '@/model/enums/user-type';

export interface EventParameters {
  [EventType.FormSubmit]: {
    succeeded: boolean;
    formId: string;
    formName?: string;
    invalidFields?: string[];
  };
  [EventType.SignUp]: {
    userType: UserType;
  };
  [EventType.ShareChallenge]: {
    userType: UserType;
  };
  [EventType.GetElectionReminders]: {
    userType: UserType;
  };
  [EventType.RegisterToVote]: {
    userType: UserType;
    USState: string;
  };
}
