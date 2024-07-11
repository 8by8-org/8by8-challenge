import 'server-only';
import { inject } from 'undecorated-di';
import { cookies } from 'next/headers';
import { DateTime } from 'luxon';
import type { ICookies } from './i-cookies';

export const Cookies = inject(
  class Cookies implements ICookies {
    private emailForSignInCookieName = '8by8-email-for-signin';

    setEmailForSignIn(email: string): Promise<void> {
      return new Promise(resolve => {
        cookies().set(this.emailForSignInCookieName, email, {
          expires: this.getEmailForSignInCookieExpiry(),
          sameSite: 'strict',
        });
        resolve();
      });
    }

    loadEmailForSignIn(): Promise<string> {
      return new Promise(resolve => {
        const cookie = cookies().get(this.emailForSignInCookieName);
        resolve(cookie?.value ?? '');
      });
    }

    clearEmailForSignIn(): void {
      cookies().delete(this.emailForSignInCookieName);
    }

    private getEmailForSignInCookieExpiry() {
      return DateTime.now().plus({ hours: 1 }).toMillis();
    }
  },
  [],
);
