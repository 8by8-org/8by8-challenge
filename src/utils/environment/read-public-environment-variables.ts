import { z } from 'zod';

/**
 * Reads and validates public environment variables. Available to both
 * client-side and server-side code.
 */
export function readPublicEnvironmentVariables() {
  return {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z
      .string({
        required_error:
          'Could not find environment variable NEXT_PUBLIC_TURNSTILE_SITE_KEY.',
      })
      .parse(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
    NEXT_PUBLIC_SUPABASE_URL: z
      .string({
        required_error:
          'Could not find environment variable NEXT_PUBLIC_SUPABASE_URL.',
      })
      .parse(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z
      .string({
        required_error:
          'Could not find environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      })
      .parse(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z
      .string()
      .optional()
      .parse(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID),
  };
}
