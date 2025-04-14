/**
 * An enumeration of custom event names that can be sent to analytics.
 *
 * @remarks
 * The value of each member of the enum should be a snake_case event name for
 * uniformity with the conventions of Google Analytics.
 */
export enum AnalyticsEventType {
  FormSubmit = 'form_submit',
  SignUp = 'sign_up',
  SignIn = 'sign_in',
  PlayerBecameChallenger = 'player_became_challenger',
  ShareChallenge = 'share_challenge',
  GetElectionReminders = 'get_election_reminders',
  RegisterToVote = 'register_to_vote',
}
