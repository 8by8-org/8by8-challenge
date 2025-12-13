import 'server-only';
import { bind } from 'undecorated-di';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Retrieves [Supabase](https://supabase.com/) credentials from environment
 * variables, calls {@link createServerClient} with those credentials, and
 * returns a {@link SupabaseClient}.
 *
 * @remarks
 * This function is designated server-only and can only be called within
 * server-only code, such as API routes or server components. The client
 * returned by this function has elevated permissions, allowing it to create
 * new users. However, it cannot bypass Row-level Security.
 *
 * To bypass RLS in repository-type classes, use {@link createSupabaseServiceRoleClient}.
 */
export const createSupabaseSSRClient = bind(
  function createSupabaseServerClient() {
    const cookieStore = cookies();
    const { NEXT_PUBLIC_SUPABASE_URL: url } = PUBLIC_ENVIRONMENT_VARIABLES;

    const { SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey } =
      PRIVATE_ENVIRONMENT_VARIABLES;

    return createServerClient(url, serviceRoleKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* 
              The `setAll` method was called from a Server Component.
              This error can be ignored because we have middleware that 
              refreshes the user. For more information, see:

              https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs&queryGroups=environment&environment=server#create-a-client
            */
          }
        },
      },
    });
  },
  [],
);
