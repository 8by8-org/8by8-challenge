import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Deletes all auth users from Supabase
 *
 * @remarks
 * Returns the number of rows deleted
 *
 * @param supabase - supabaseClient instance
 * @returns The number of auth users
 */
export async function deleteAuthUsers(
  supabase: SupabaseClient,
): Promise<number> {
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) throw new Error(error.message);

  for (const user of users) {
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) throw new Error(error.message);
  }

  return users.length;
}
