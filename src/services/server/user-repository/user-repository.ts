import type { User } from '@/model/types/user';


/**
 * Provides methods for retrieving user information from a database.
 */
export interface UserRepository {
  getUserById(userId: string): Promise<User | null>;
<<<<<<< HEAD
  awardSharedBadge(userId: string): Promise<User>;
=======
  awardElectionRemindersBadge(userId: string): Promise<User>;
>>>>>>> upstream/development
}
