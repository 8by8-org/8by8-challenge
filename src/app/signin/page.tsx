'use client';
import { useState, type FormEventHandler } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, ValidityUtils } from 'fully-formed';
import { isSignedOut } from '@/components/guards/is-signed-out';
import { SignInForm } from './signin-form';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { PageContainer } from '@/components/utils/page-container';
import { InputGroup } from '@/components/form-components/input-group';
import { Turnstile } from '@/components/form-components/turnstile';
import { waitForPendingValidators } from '@/utils/client/wait-for-pending-validators';
import { scrollToElementById } from '@/utils/client/scroll-to-element-by-id';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';
import { FormInvalidError } from '@/utils/client/form-invalid-error';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { isErrorWithMessage } from '@/utils/shared/is-error-with-message';
import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import { getInvalidFieldNames } from '@/utils/client/get-invalid-field-names';
import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';
import styles from './styles.module.scss';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Sign in`,
};

export default isSignedOut(function SignIn() {
  const signInForm = useForm(new SignInForm());
  const formId = 'signin-form';
  const formName = 'signinForm';
  const { sendOTPToEmail } = useContextSafely(UserContext, 'SignIn');
  const { showAlert } = useContextSafely(AlertsContext, 'SignIn');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();
    if (isLoading) return;
    signInForm.setSubmitted();
    setIsLoading(true);

    try {
      const formValue = await waitForPendingValidators(signInForm);
      await sendOTPToEmail(formValue);
      sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
        formId,
        formName,
        succeeded: true,
      });
    } catch (e) {
      setIsLoading(false);

      if (e instanceof FormInvalidError) {
        if (!ValidityUtils.isValid(signInForm.fields.email)) {
          focusOnElementById(signInForm.fields.email.id);
        } else {
          scrollToElementById(signInForm.fields.captchaToken.id);
        }
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId,
          formName,
          succeeded: false,
          invalidFields: getInvalidFieldNames(signInForm),
        });
      } else {
        showAlert(
          isErrorWithMessage(e) ?
            e.message
          : 'Something went wrong. Please try again.',
          'error',
        );
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId,
          formName,
          succeeded: false,
        });
      }
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
          <InputGroup
            field={signInForm.fields.email}
            type="email"
            labelVariant="floating"
            labelContent="Email address*"
            containerClassName={styles.input_group}
            disabled={isLoading}
          />
          <Turnstile field={signInForm.fields.captchaToken} />
        </div>
        <div className={styles.submit_btn_container}>
          <button
            type="submit"
            className="btn_gradient btn_lg btn_wide"
            disabled={isLoading}
          >
            Sign in
          </button>
        </div>
      </form>
      <div className={styles.sign_up_link_container}>
        <p>
          New to 8by8?{' '}
          <Link href="/signup" className="link">
            Sign up
          </Link>
        </p>
      </div>
    </PageContainer>
  );
});
