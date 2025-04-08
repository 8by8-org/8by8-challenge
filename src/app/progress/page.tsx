'use client';
import Image from 'next/image';
import Link from 'next/link';
import { PageContainer } from '@/components/utils/page-container';
import { UserContext } from '@/contexts/user-context';
import { calculateDaysRemaining } from './calculate-days-remaining';
import { useContextSafely } from '@/hooks/use-context-safely';
import { LinkButton } from '@/components/utils/link-button';
import claimReward from '@/../public/static/images/pages/progress/claiming-a-reward.svg';
import daysRemainingBlob from '@/../public/static/images/pages/progress/days-remaining-blob.svg';
import { ConfettiAnimation } from '@/components/utils/confetti-animation';
import blackCurve from '@/../public/static/images/pages/progress/black-curve.svg';
import { Badges } from '@/components/progress/badges';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { VoterRegistrationPathnames } from '../register/constants/voter-registration-pathnames';
import styles from './styles.module.scss';

export default isSignedIn(function Progress() {
  const { user } = useContextSafely(UserContext, 'UserContext');
  const daysLeft = calculateDaysRemaining(user);

  return (
    <PageContainer>
      <article className={styles.progress_page}>
        {user!.completedChallenge ?
          <ConfettiAnimation time={8000} />
        : null}
        <section className={styles.section_1}>
          <h1>
            {user!.completedChallenge ?
              <>
                You&apos;ve Won! <br /> The <br />
                Challenge
              </>
            : <>
                Your <br /> challenge <br /> badges
              </>
            }
          </h1>
          <div className={styles.days_blob_container}>
            <Image
              className={styles.blob}
              src={user!.completedChallenge ? claimReward : daysRemainingBlob}
              alt="days remaining blob"
              priority={true}
            />
            {!user!.completedChallenge && (
              <div className={styles.days_label}>
                <p className={styles.number_shadow}>{daysLeft}</p>
                <h3 className={styles.days_left}>
                  {daysLeft === 1 ? 'Day' : 'Days'} left
                </h3>
              </div>
            )}
          </div>
        </section>
        <Image
          className={styles.curve}
          src={blackCurve}
          alt="black curve"
          priority={true}
        />

        <section className={styles.section_2}>
          <h3>
            You completed{' '}
            {user!.badges.filter(badge => badge !== null).length === 8 ?
              ' all '
            : ' '}
            <span className={styles.underline}>
              {user!.badges.filter(badge => badge !== null).length}
            </span>{' '}
            badges
          </h3>

          <LinkButton href="/share" size="lg" wide>
            Invite Friends
          </LinkButton>
          {!user!.completedActions.registerToVote && (
            <div>
              <p className={styles.register}>
                Not registered to vote yet?
                <br />
                <Link href={VoterRegistrationPathnames.ELIGIBILITY}>
                  Register now
                </Link>{' '}
                and earn a badge!
              </p>
            </div>
          )}
        </section>
        <Badges badges={user!.badges} />

        <section className={styles.section_4}>
          <LinkButton href="/share" size="lg" wide>
            Invite Friends
          </LinkButton>
          {!user!.completedActions.registerToVote && (
            <div>
              <p className={styles.register}>
                Not registered to vote yet?
                <br />
                <Link href={VoterRegistrationPathnames.ELIGIBILITY}>
                  Register now
                </Link>{' '}
                and earn a badge!
              </p>
            </div>
          )}
        </section>
      </article>
    </PageContainer>
  );
});
