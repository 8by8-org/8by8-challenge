import 'server-only';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import type { ChainedMiddleware } from './chained-middleware';

export function sentOTP(next: ChainedMiddleware): ChainedMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response?: NextResponse,
  ) => {
    const { pathname } = request.nextUrl;

    if (pathname === '/signin-with-otp') {
      const cookies = serverContainer.get(SERVER_SERVICE_KEYS.Cookies);
      const emailForSignIn = await cookies.loadEmailForSignIn();

      /* istanbul ignore else */
      if (!emailForSignIn) {
        return NextResponse.redirect(
          new URL('/signin', request.nextUrl.origin),
        );
      }
    }

    return next(request, event, response);
  };
}
