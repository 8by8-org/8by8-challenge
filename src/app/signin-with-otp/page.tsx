'use client';
import { useState, type FormEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, ValidityUtils } from 'fully-formed';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { PageContainer } from '@/components/utils/page-container';
import { InputGroup } from '@/components/form-components/input-group';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';
import { sentOTP } from '@/components/guards/sent-otp';
import { SignInWithOTPForm } from './signin-with-otp-form';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { isSignedOut } from '@/components/guards/is-signed-out';
import { useCountdown } from '@/hooks/use-countdown';
import { Button } from '@/components/utils/button';
import { isErrorWithMessage } from '@/utils/shared/is-error-with-message';
import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import styles from './styles.module.scss';

export default isSignedOut(
  sentOTP(function SignInWithOTP() {
    const form = useForm(new SignInWithOTPForm());
    const formId = 'signin-with-otp';
    const formName = 'signinWithOTP';
    const userContext = useContextSafely(UserContext, 'SignInWithOTP');
    const { showAlert } = useContextSafely(AlertsContext, 'SignInWithOTP');
    const { countdown, restartCountdown } = useCountdown(60);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit: FormEventHandler = async e => {
      e.preventDefault();
      if (isLoading) return;
      form.setSubmitted();

      if (!ValidityUtils.isValid(form)) {
        focusOnElementById(form.fields.otp.id);
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId,
          formName,
          succeeded: false,
          invalidFields: [form.fields.otp.id],
        });
        return;
      }

      try {
        setIsLoading(true);
        await userContext.signInWithOTP(form.state.value);
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId,
          formName,
          succeeded: true,
        });
      } catch (e) {
        setIsLoading(false);
        showAlert(
          isErrorWithMessage(e) ?
            e.message
          : 'There was a problem signing in. Please try again.',
          'error',
        );
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId,
          formName,
          succeeded: false,
        });
      }
    };

    const resendOTP: FormEventHandler = async e => {
      e.preventDefault();
      setIsLoading(true);

      try {
        await userContext.resendOTP();
        showAlert('Code sent. Please check your email.', 'success');
      } catch (e) {
        showAlert(
          isErrorWithMessage(e) ?
            e.message
          : 'Error sending code. Please try again.',
          'error',
        );
      } finally {
        restartCountdown();
        setIsLoading(false);
      }
    };

    return (
      <PageContainer>
        {isLoading && <LoadingWheel />}
        <form id={formId} name={formName} onSubmit={onSubmit} noValidate>
          <div className={styles.title_and_fields_container}>
            <div className={styles.hero}>
              <h1>
                Welcome
                <br />
                back!
              </h1>
              <Image
                src="/static/images/pages/signin/person-voting.png"
                width={144}
                height={144}
                alt="person voting"
                className={styles.person_voting}
              />
            </div>
            <p className={styles.passcode_sent_to}>
              A one time passcode has been sent to
              <br />
              <span className="b5">{userContext.emailForSignIn}</span>
            </p>
            <InputGroup
              field={form.fields.otp}
              type="number"
              labelVariant="floating"
              labelContent="One time passcode*"
              disabled={isLoading}
              containerClassName={styles.input_group}
            />
          </div>
          <div className={styles.resend_otp_container}>
            {countdown > 0 ?
              <p className={styles.countdown}>Resend Code ({countdown}s)</p>
            : <button
                onClick={resendOTP}
                className={styles.resend_otp}
                disabled={isLoading}
              >
                Resend Code
              </button>
            }
          </div>
          <div className={styles.submit_btn_container}>
            <Button
              type="submit"
              size="lg"
              wide
              className="mb_sm"
              disabled={isLoading}
            >
              Sign in
            </Button>
            <p>
              <Link href="/signin" className="link">
                Sign in
              </Link>{' '}
              with a different email address.
            </p>
          </div>
        </form>
      </PageContainer>
    );
  }),
);
