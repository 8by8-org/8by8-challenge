import { UserType } from '../enums/user-type.enum';
import type { Avatar } from '../types/avatar.type';
import type { BadgeDoc } from '../types/badge-doc.type';

/**
 * Represents a document in the users collection of the Firestore database.
 */
export interface UserDoc {
  email: string;
  name: string;
  avatar: Avatar;
  userType: UserType;
  completedActions: {
    electionReminders: boolean;
    registerToVote: boolean;
    sharedChallenge: boolean;
  };
  badges: BadgeDoc[];
  challengeEndDate: string;
  completedChallenge: boolean;
  redeemedAward: boolean;
  /**
   * If the user is a player (a user of type UserType.Player or
   * UserType.Hybrid), this object contains information about the challenger
   * that referred them.
   *
   * @remarks
   * The uid field will be used to award the challenger a badge when the
   * player completes an action. The name and avatar fields are
   * used to display the name and avater of the challenger within the UI
   * for the player once the player has completed an action towards the
   * challenger's challenge.
   */
  invitedBy?: {
    uid: string;
    name: string;
    avatar: Avatar;
  };
  /**
   * Represents whether a player (a user of type UserType.Player or
   * UserType.Hybrid) has taken an action on behalf of a challenger.
   *
   * @remarks
   * Each player may only take one action on behalf of one challenger. If this
   * field is `true`, any subsequent actions taken by the user will not award
   * that challenger a badge.
   */
  completedActionForChallenger: boolean;
}
