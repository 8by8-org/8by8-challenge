import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { CSRF_COOKIE } from '@/utils/csrf/constants';
import { createCSRFToken } from '@/utils/csrf/create-csrf-token';
import { validateCSRFToken } from '@/utils/csrf/validate-csrf-tokens';
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from 'next/server';
import type { ChainedMiddleware } from './chained-middleware';

/**
 * Provides simple protection again CSRF attacks using the double-submit token
 * pattern.
 *
 * For more information, please see
 * {@link https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html}
 */
export function csrfProtection(next: ChainedMiddleware): ChainedMiddleware {
  return (
    request: NextRequest,
    event: NextFetchEvent,
    response?: NextResponse,
  ) => {
    /*
      If the route is an API route, verify the token. Prevent the user from 
      accessing the route if they do not have a valid token.
    */
    if (request.nextUrl.pathname.startsWith('/api')) {
      if (!validateCSRFToken(request)) {
        return NextResponse.json(
          { error: 'Invalid CSRF token.' },
          { status: 403 },
        );
      }
    } else {
      /*
        Otherwise, if the route is not an API route, set a token as a cookie.
        httpOnly must be false so that client-side code can read the cookie and 
        set it as a header, but sameSite must be strict to prevent attackers 
        from accessing its value.
      */
      /* istanbul ignore else */
      if (!response) response = NextResponse.next();

      response?.cookies.set(CSRF_COOKIE, createCSRFToken(), {
        httpOnly: false,
        sameSite: 'strict',
        secure: PRIVATE_ENVIRONMENT_VARIABLES.APP_ENV === 'production',
      });
    }

    return next(request, event, response);
  };
}
