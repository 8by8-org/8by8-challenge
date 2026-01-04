import 'server-only';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import type { ChainedMiddleware } from './chained-middleware';

export function refreshSession(next: ChainedMiddleware): ChainedMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response?: NextResponse,
  ) => {
    if (!response) response = NextResponse.next({ request });

    const {
      NEXT_PUBLIC_SUPABASE_URL: url,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    } = PUBLIC_ENVIRONMENT_VARIABLES;

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        /* istanbul ignore next */
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            response!.cookies.set(name, value, options),
          );
        },
      },
    });

    // By calling auth.getUser(), we refresh the user's session.
    await supabase.auth.getUser();
    return next(request, event, response);
  };
}
