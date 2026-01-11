import 'server-only';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { UserType } from '@/model/enums/user-type';
import type { ChainedMiddleware } from './chained-middleware';

export function isPlayerOrHybrid(next: ChainedMiddleware): ChainedMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response?: NextResponse,
  ) => {
    if (request.nextUrl.pathname === '/actions') {
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

      const { data } = await supabase.auth.getUser();

      /* istanbul ignore else */
      if (data.user) {
        const userRepo = serverContainer.get(
          SERVER_SERVICE_KEYS.UserRepository,
        );

        const user = await userRepo.getUserById(data.user.id);

        if (user?.type === UserType.Challenger) {
          return NextResponse.redirect(
            new URL('/progress', request.nextUrl.origin),
          );
        }
      }
    }

    return next(request, event, response);
  };
}
