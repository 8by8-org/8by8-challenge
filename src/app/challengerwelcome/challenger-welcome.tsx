'use client';
import { useEffect } from 'react';
import { isSignedOut } from '@/components/guards/is-signed-out';
import { wasNotInvited } from '@/components/guards/was-not-invited';
import { PageContainer } from '@/components/utils/page-container';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import top from '../../../public/static/images/pages/challenger-welcome/black-curve-lg.png';
import stepOne from '../../../public/static/images/pages/challenger-welcome/step-1.png';
import stepTwo from '../../../public/static/images/pages/challenger-welcome/step-2.png';
import stepThree from '../../../public/static/images/pages/challenger-welcome/step-3.png';
import stepFour from '../../../public/static/images/pages/challenger-welcome/step-4.png';
import logo from '../../../public/static/images/shared/8by8-logo.svg';
import styles from './styles.module.scss';
import  { Button, type ButtonProps } from '../../components/utils/button/button';

export const ChallengerWelcome = isSignedOut(
  wasNotInvited(function ChallengerWelcome() {
    const router = useRouter();

    useEffect(() => {
      router.prefetch('/signup');
    }, [router]);

    return (
      <PageContainer>
        <section className={styles.section_1}>
          <Image
            className={styles.background}
            src={top}
            alt="background"
            priority={true}
          />

          <div className={styles.container}>
            <Image
              className={styles.logo}
              src={logo}
              alt="8by8 Logo"
              priority={true}
            />
          </div>
        </section>

        <section className={styles.section_2}>
          <h1 className={styles.underline}>Welcome!</h1>

          <p className={styles.content}>
            Closing the voter registration gap has to be a community effort, so
            we&apos;re asking everyone to join us in taking the
            #8by8Challenge—register 8 friends to register to vote in 8 days!
          </p>

          <Button
            type="button"
            className={styles.get_started_btn}
            onClick={() => router.push('/signup')}
          >
            Get Started
          </Button>


          <p className={styles.signin_line}>
            Already have an account? <Link href="/signin">Sign in</Link>
          </p>

          <Link className={styles.teal_link} href="/why8by8">
            See why others are doing it
          </Link>
        </section>

        <section className={styles.content_3}>
          <h2 className={styles.underline}>Here&apos;s How it Works</h2>

          <h3 className={styles.step_header}>1. Sign Up</h3>
          <p className={styles.step_text}>
            Sign up with your name and email address to get started.
          </p>
          <Image src={stepOne} alt="sign up" className={styles.image} />

          <h3 className={styles.step_header}>2. Invite your friends</h3>
          <p className={styles.step_text}>
            Get 8 friends via social media or messaging apps to join your
            challenge.
          </p>
          <Image
            src={stepTwo}
            alt="invite your friends"
            className={styles.image}
          />

          <h3 className={styles.step_header}>3. Friends take action</h3>
          <p className={styles.step_text}>
            Your friends can support your challenge by taking 1 of 3 actions:
            register to vote, set up election reminders, or take the challenge
            themselves. You&apos;ll earn 1 badge per friend who takes action!
          </p>
          <Image
            src={stepThree}
            alt="friends take action"
            className={styles.image}
          />

          <h3 className={styles.step_header}>4. Win the challenge!</h3>
          <p className={styles.step_text}>
            When 8 of your friends have taken action towards your challenge in 8
            days, you win!
          </p>
          <Image
            src={stepFour}
            alt="earn 8 badges in 8 days"
            className={styles.image}
          />

          <Button
            type="button"
            className={styles.get_started_btn}
            onClick={() => router.push('/signup')}
          >
            Get Started
          </Button>

          <p className={styles.signin_line}>
            Already have an account?{' '}
            <Link className={styles.signin_link_black} href="/signin">
              Sign in
            </Link>
          </p>
        </section>
      </PageContainer>
    );
  }),
);
