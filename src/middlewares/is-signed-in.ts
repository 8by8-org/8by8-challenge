import 'server-only';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import type { ChainedMiddleware } from './chained-middleware';

export const SIGNED_IN_ONLY_ROUTES = ['/progress', '/register', '/reminders'];

export function isSignedIn(next: ChainedMiddleware): ChainedMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response?: NextResponse,
  ) => {
    if (
      SIGNED_IN_ONLY_ROUTES.some(route =>
        request.nextUrl.pathname.startsWith(route),
      )
    ) {
      let supabaseResponse = NextResponse.next({
        request,
      });

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
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.redirect(
          new URL('/signin', request.nextUrl.origin),
        );
      }
    }

    return next(request, event, response);
  };
}
