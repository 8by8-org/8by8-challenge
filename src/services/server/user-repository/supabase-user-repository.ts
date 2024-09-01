import { inject } from 'undecorated-di';
import { SERVER_SERVICE_KEYS } from '../keys';
import { ServerError } from '@/errors/server-error';
import type { UserRepository } from './user-repository';
import type { User } from '@/model/types/user';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';
import type { IUserRecordParser } from '../user-record-parser/i-user-record-parser';
import { ActionBadge } from '@/model/types/action-badge';
import { Actions } from '@/model/enums/actions';
import type { Badge } from '@/model/types/badge';


/**
 * An implementation of {@link UserRepository} that interacts with
 * a [Supabase](https://supabase.com/) database and parses rows returned from
 * that database into {@link User}s.
 */
export const SupabaseUserRepository = inject(
  class SupabaseUserRepository implements UserRepository {
    constructor(
      private createSupabaseClient: CreateSupabaseClient,
      private userRecordParser: IUserRecordParser,
    ) {}

    async getUserById(userId: string): Promise<User | null> {
      const supabase = this.createSupabaseClient();

      const { data: dbUser, error } = await supabase
        .from('users')
        .select(
          `*,
          completed_actions (election_reminders, register_to_vote, shared_challenge),
          badges (action, player_name, player_avatar),
          invited_by (challenger_invite_code, challenger_name, challenger_avatar),
          contributed_to (challenger_name, challenger_avatar)`
        )
        .eq('id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new ServerError(error.message, 500);
      }

      if (!dbUser) return null;

      try {
        const user = this.userRecordParser.parseUserRecord(dbUser);
        return user;
      } catch (e) {
        throw new ServerError('Failed to parse user data.', 400);
      }
    }
    /**
     * @updateRegisterToVoteAction
     * @param id - User's id to get user
     */
    async updateRegisterToVoteAction(userId: string): Promise<void> {
      const supabase = this.createSupabaseClient();
      const { error: challengerUpdateError } = await supabase
        .from('completed_actions')
        .update({
          register_to_vote: true,
        })
        .eq('user_id', userId);

      if (challengerUpdateError) {
        throw new Error(challengerUpdateError.message);
      }
    }
    /**
     * @awardUserBadge
     * @param id - User's id to get user
     */
    async awardVoterRegistrationActionBadge(id: string, badges: Badge[]): Promise<void> {
          const supabase = this.createSupabaseClient();
          const actionBadges = badges.filter(obj => {
            return (obj as ActionBadge).action !== undefined;
          });
    
          let found = false;
          actionBadges.forEach(item => {
            if ((item as ActionBadge).action === 'voterRegistration') {
              found = true;
            }
          });
    
          if (badges.length >= 8 || found) {
            return;
          }
    
          const challengerActionBadge = {
            action: Actions.VoterRegistration,
            challenger_id: id,
          };
    
          const { error: challengerActionBadgeInsertionError } = await supabase
            .from('badges')
            .insert(challengerActionBadge)
            .eq('user_id', id);
    
          if (challengerActionBadgeInsertionError) {
            throw new Error(challengerActionBadgeInsertionError.message);
          }
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseClient,
    SERVER_SERVICE_KEYS.UserRecordParser,
  ],
);
