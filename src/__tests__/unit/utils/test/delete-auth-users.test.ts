import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { UserType } from '@/model/enums/user-type';
import { deleteAuthUsers } from '@/utils/test/delete-auth-users';
import { createId } from '@paralleldrive/cuid2';
import { createBrowserClient } from '@supabase/ssr';
import { Builder } from 'builder-pattern';
import { v4 as uuid } from 'uuid';
import {
  AuthError,
  type User,
  type GoTrueAdminApi,
  type SupabaseClient,
} from '@supabase/supabase-js';
import type { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js';

describe('deleteAuthUsers', () => {
  it('deletes all rows from auth.users.', async () => {
    const supabase = createBrowserClient(
      PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
      PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
    );

    for (let i = 0; i < 10; i++) {
      const { error } = await supabase.auth.admin.createUser({
        email: `user${i}@example.com`,
        email_confirm: true,
        user_metadata: {
          name: `User ${i}`,
          avatar: '0',
          type: UserType.Challenger,
          invite_code: createId(),
        },
      });

      if (error) throw new Error(error.message);
    }

    const {
      data: { users: beforeDeleteAuthUsers },
    } = await supabase.auth.admin.listUsers();
    expect(beforeDeleteAuthUsers.length).toBe(10);

    await deleteAuthUsers(supabase);
    const {
      data: { users: afterDeleteAuthUsers },
    } = await supabase.auth.admin.listUsers();
    expect(afterDeleteAuthUsers.length).toBe(0);
  });

  it('throws an error if supabase.auth.admin.listUsers() returns an error.', async () => {
    const error = new AuthError('Failed to list users.');

    const supabaseAdmin = Builder<GoTrueAdminApi>()
      .listUsers(() => {
        return Promise.resolve({
          data: {
            users: [],
          },
          error,
        });
      })
      .build();

    const supabaseAuth = Builder<SupabaseAuthClient>()
      .admin(supabaseAdmin)
      .build();

    const supabase = Builder<SupabaseClient>().auth(supabaseAuth).build();

    await expect(deleteAuthUsers(supabase)).rejects.toThrow(error.message);
  });

  it('throws an error if supabase.auth.admin.deleteUser() returns an error.', async () => {
    const error = new AuthError('Failed to delete user.');

    const supabaseAdmin = Builder<GoTrueAdminApi>()
      .listUsers(() => {
        return Promise.resolve({
          data: {
            users: [Builder<User>().id(uuid()).build()],
            aud: '',
            nextPage: null,
            lastPage: 0,
            total: 1,
          },
          error: null,
        });
      })
      .deleteUser(() => {
        return Promise.resolve({
          data: { user: null },
          error,
        });
      })
      .build();

    const supabaseAuth = Builder<SupabaseAuthClient>()
      .admin(supabaseAdmin)
      .build();

    const supabase = Builder<SupabaseClient>().auth(supabaseAuth).build();
    await expect(deleteAuthUsers(supabase)).rejects.toThrow(error.message);
  });
});
