'use client';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { isPlayerOrHybrid } from '@/components/guards/is-player-or-hybrid';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { PageContainer } from '@/components/utils/page-container';
import { ConfettiAnimation } from '@/components/utils/confetti-animation';
import { Hero } from './hero/hero';
import { AvailableActions } from './available-actions';
import { BadgeAwardedMessage } from './badge-awarded-message';
import { Links } from './links';
import { hasCompletedAllActions } from './utils/has-completed-all-actions';
import styles from './styles.module.scss';

export default isSignedIn(
  isPlayerOrHybrid(function ActionsPage() {
    const { user } = useContextSafely(UserContext, 'ActionsPage');

    return (
      <PageContainer theme="dark">
        {hasCompletedAllActions(user) && <ConfettiAnimation time={8000} />}
        <Hero />
        <div className={styles.white_curve}></div>
        <section className={styles.actions_section}>
          <BadgeAwardedMessage />
          <AvailableActions />
        </section>
        <Links />
      </PageContainer>
    );
  }),
);
