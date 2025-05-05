import { CSRF_COOKIE, CSRF_HEADER } from './constants';
import type { NextRequest } from 'next/server';

/**
 * Validates the CSRF token by comparing the value in the request's cookies
 * with the value in the request's headers.
 *
 * This function is typically used in Next.js API routes or middleware
 * to prevent cross-site request forgery (CSRF) attacks.
 *
 * @example
 * ```typescript
 * import { validateCSRFToken } from './csrf';
 * import { NextRequest } from 'next/server';
 *
 * export function middleware(request: NextRequest) {
 *   if (!validateCSRFToken(request)) {
 *     return new Response("Forbidden", { status: 403 });
 *   }
 *   return new Response("OK", { status: 200 });
 * }
 * ```
 *
 * @param {NextRequest} request - The incoming request object from Next.js.
 * @returns {boolean} `true` if the CSRF token is valid, otherwise `false`.
 */
export function validateCSRFToken(request: NextRequest) {
  const cookie = request.cookies.get(CSRF_COOKIE);
  const header = request.headers.get(CSRF_HEADER);

  if (!cookie || !cookie.value || !header) return false;

  return header === cookie.value;
}
