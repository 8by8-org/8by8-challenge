import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import { PUBLIC_ENVIRONMENT_VARIABLES } from '@/constants/public-environment-variables';
import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';
import { MockNextCookies } from './mock-next-cookies';
import type { User } from '@/model/types/user';

/**
 * Given a User and NextRequest arguments, returns a new NextRequest where the user is signed-in
 *
 * @remarks
 * Learn more about generateLink and verifyOtp here
 * {@link https://supabase.com/docs/reference/javascript/auth-admin-generatelink | GenerateLink }
 * {@link https://supabase.com/docs/reference/javascript/auth-verifyotp | verifyOTP}
 *
 * Note that was not in the verityOtp doc above:
 * supabase.auth.verifyOtp uses our custom mockCookies to set access_token and refresh_token
 *
 * @param user - {@link User}
 * @param ...args - arguments for creating a NextRequest
 *
 * @returns A mocked signed-in NextRequest
 */
export async function getSignedInRequestWithUser(
  user: User,
  ...args: ConstructorParameters<typeof NextRequest>
) {
  const mockCookies = new MockNextCookies();

  const supabase = createServerClient(
    PUBLIC_ENVIRONMENT_VARIABLES.NEXT_PUBLIC_SUPABASE_URL,
    PRIVATE_ENVIRONMENT_VARIABLES.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll() {
          return mockCookies.cookies().getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            mockCookies.cookies().set(name, value, options),
          );
        },
      },
    },
  );

  const { data, error: generateLinkError } =
    await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email,
    });

  if (generateLinkError) throw new Error(generateLinkError.message);

  const { error: verifyOtpError } = await supabase.auth.verifyOtp({
    email: user.email,
    type: 'email',
    token: data.properties.email_otp,
  });

  if (verifyOtpError) throw new Error(verifyOtpError.message);

  const authCookie = mockCookies.cookies().getAll()[0];

  const request = new NextRequest(...args);
  request.cookies.set(authCookie.name, authCookie.value);
  return request;
}
