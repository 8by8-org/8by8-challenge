import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import { sendGAEvent } from '@next/third-parties/google';
import { UserType } from '@/model/enums/user-type';

jest.mock('@next/third-parties/google', () => {
  return {
    ...jest.requireActual('@next/third-parties/google'),
    sendGAEvent: jest.fn(),
  };
});

describe('sendAnalyticsEvent', () => {
  afterEach(() => {
    jest.clearAllMocks;
  });

  afterAll(() => {
    jest.unmock('@next/third-parties/google');
  });

  it('sends successful form_submit events to Google Analytics.', () => {
    const parameters = {
      formId: 'test-form',
      formName: 'testForm',
      succeeded: true,
    };

    sendAnalyticsEvent(AnalyticsEventType.FormSubmit, parameters);

    expect(sendGAEvent).toHaveBeenCalledWith(
      'event',
      AnalyticsEventType.FormSubmit,
      {
        form_id: parameters.formId,
        form_name: parameters.formName,
        succeeded: parameters.succeeded,
      },
    );
  });

  it('sends failed form_submit events to Google Analytics.', () => {
    const parameters = {
      formId: 'test-form',
      formName: 'testForm',
      succeeded: false,
      invalidFields: ['field1', 'field2'],
    };

    sendAnalyticsEvent(AnalyticsEventType.FormSubmit, parameters);

    expect(sendGAEvent).toHaveBeenCalledWith(
      'event',
      AnalyticsEventType.FormSubmit,
      {
        form_id: parameters.formId,
        form_name: parameters.formName,
        succeeded: parameters.succeeded,
        invalid_fields: parameters.invalidFields,
      },
    );
  });

  it('sends sign_up events to Google Analytics.', () => {
    /*
      In practice, a user will only sign up as a challenger or a player, and can 
      become a hybrid-type user by either taking the challenge as a player or 
      visiting another user's invite link as a challenger.
    */
    const userTypes = [UserType.Challenger, UserType.Player];

    for (const userType of userTypes) {
      sendAnalyticsEvent(AnalyticsEventType.SignUp, {
        userType,
      });

      expect(sendGAEvent).toHaveBeenLastCalledWith(
        'event',
        AnalyticsEventType.SignUp,
        {
          user_type: userType,
        },
      );
    }
  });

  it('sends sign_in events to Google Analytics.', () => {
    sendAnalyticsEvent(AnalyticsEventType.SignIn);
    expect(sendGAEvent).toHaveBeenCalledWith(
      'event',
      AnalyticsEventType.SignIn,
      {},
    );
  });

  it('sends share_challenge events to Google Analytics.', () => {
    const userTypes = [UserType.Challenger, UserType.Player, UserType.Hybrid];

    for (let i = 0; i < userTypes.length; i++) {
      const parameters = {
        userType: userTypes[i],
        firstShare: i % 2 === 0,
      };

      sendAnalyticsEvent(AnalyticsEventType.ShareChallenge, parameters);

      expect(sendGAEvent).toHaveBeenLastCalledWith(
        'event',
        AnalyticsEventType.ShareChallenge,
        {
          user_type: parameters.userType,
          first_share: parameters.firstShare,
        },
      );
    }
  });

  it('sends get_election_reminder events to Google Analytics.', () => {
    const userTypes = [UserType.Challenger, UserType.Player, UserType.Hybrid];

    for (const userType of userTypes) {
      sendAnalyticsEvent(AnalyticsEventType.GetElectionReminders, {
        userType,
      });

      expect(sendGAEvent).toHaveBeenLastCalledWith(
        'event',
        AnalyticsEventType.GetElectionReminders,
        {
          user_type: userType,
        },
      );
    }
  });

  it('sends register_to_vote events to Google Analytics.', () => {
    const userTypes = [UserType.Challenger, UserType.Player, UserType.Hybrid];
    const states = ['AZ', 'PA', 'TX'];

    for (let i = 0; i < userTypes.length; i++) {
      const parameters = {
        userType: userTypes[i],
        USState: states[i],
      };

      sendAnalyticsEvent(AnalyticsEventType.RegisterToVote, parameters);

      expect(sendGAEvent).toHaveBeenLastCalledWith(
        'event',
        AnalyticsEventType.RegisterToVote,
        {
          user_type: parameters.userType,
          us_state: parameters.USState,
        },
      );
    }
  });

  it('sends player_became_challenger events to Google Analytics.', () => {
    sendAnalyticsEvent(AnalyticsEventType.PlayerBecameChallenger);
    expect(sendGAEvent).toHaveBeenCalledWith(
      'event',
      AnalyticsEventType.PlayerBecameChallenger,
      {},
    );
  });
});
