'use client';
import { usePathname } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { useForm } from 'fully-formed';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { useRedirectToFirstIncompletePage } from './utils/use-redirect-to-first-incomplete-page';
import { VoterRegistrationForm } from './voter-registration-form';
import { VoterRegistrationContext } from './voter-registration-context';
import { PageContainer } from '@/components/utils/page-container';
import { ProgressBar } from './progress-bar';
import type { PropsWithChildren } from 'react';
import styles from './styles.module.scss';

export default isSignedIn(function VoterRegistrationLayout({
  children,
}: PropsWithChildren) {
  const { user } = useContextSafely(UserContext, 'VoterRegistrationLayout');
  const voterRegistrationForm = useForm(new VoterRegistrationForm(user));
  useRedirectToFirstIncompletePage(voterRegistrationForm);
  const pathname = usePathname();

  return (
    <VoterRegistrationContext.Provider value={{ voterRegistrationForm }}>
      <PageContainer>
        <div className={styles.container}>
          {pathname !== '/register/completed' && (
            <>
              <h1>
                <span className="underline">Register</span> to Vote
              </h1>
              <div className={styles.progress_bar_container}>
                <ProgressBar />
              </div>
            </>
          )}
          {children}
        </div>
      </PageContainer>
    </VoterRegistrationContext.Provider>
  );
});
