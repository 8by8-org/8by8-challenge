'use client';
import { useState, type FormEventHandler } from 'react';
import Link from 'next/link';
import { useForm } from 'fully-formed';
import { isSignedOut } from '@/components/guards/is-signed-out';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { SignUpForm } from './signup-form';
import { PageContainer } from '@/components/utils/page-container';
import { InputGroup } from '@/components/form-components/input-group';
import { SelectAvatar } from './select-avatar';
import { Turnstile } from '@/components/form-components/turnstile/turnstile';
import { waitForPendingValidators } from '@/utils/client/wait-for-pending-validators';
import { getFirstNonValidInputId } from './get-first-non-valid-input-id';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';
import { scrollToElementById } from '@/utils/client/scroll-to-element-by-id';
import { FormInvalidError } from '@/utils/client/form-invalid-error';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { isErrorWithMessage } from '@/utils/shared/is-error-with-message';
import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import { getInvalidFieldNames } from '@/utils/client/get-invalid-field-names';
import styles from './styles.module.scss';
import { Button } from '../../components/utils/button';

export default isSignedOut(function SignUp() {
  const signUpForm = useForm(new SignUpForm());
  const formId = 'signup-form';
  const formName = 'signUpForm';
  const { signUpWithEmail } = useContextSafely(UserContext, 'SignUp');
  const { showAlert } = useContextSafely(AlertsContext, 'SignUp');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: FormEventHandler = async e => {
    e.preventDefault();
    if (isLoading) return;
    signUpForm.setSubmitted();
    setIsLoading(true);

    try {
      const formValue = await waitForPendingValidators(signUpForm);
      await signUpWithEmail(formValue);
      sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
        formId,
        formName,
        succeeded: true,
      });
    } catch (e: any) {
      setIsLoading(false);

      if (e instanceof FormInvalidError) {
        const firstNonValidInputId = getFirstNonValidInputId(signUpForm);
        if (firstNonValidInputId === signUpForm.fields.captchaToken.id) {
          scrollToElementById(firstNonValidInputId);
        } else if (firstNonValidInputId) {
          focusOnElementById(firstNonValidInputId);
        }
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId,
          formName,
          succeeded: false,
          invalidFields: getInvalidFieldNames(signUpForm),
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
          <h1 className={styles.title}>
            <span className="underline">Sign Up</span>
            <br />
            to Start Your
            <br />
            8by8 Journey
          </h1>
          <p className={styles.instruction}>*Required information</p>
          <InputGroup
            type="text"
            field={signUpForm.fields.name}
            labelContent="Name*"
            labelVariant="floating"
            containerClassName={styles.input_group}
            maxLength={255}
            disabled={isLoading}
            aria-required
          />
          <InputGroup
            type="email"
            field={signUpForm.fields.email}
            labelContent="Email address*"
            labelVariant="floating"
            containerClassName={styles.input_group}
            disabled={isLoading}
            aria-required
            autoComplete="email"
          />
          <InputGroup
            type="email"
            field={signUpForm.fields.confirmEmail}
            groups={[signUpForm.groups.emailGroup]}
            labelContent="Re-enter email address*"
            labelVariant="floating"
            containerClassName={styles.input_group}
            disabled={isLoading}
            aria-required
            autoComplete="email"
          />
        </div>
        <SelectAvatar field={signUpForm.fields.avatar} isLoading={isLoading} />
        <Turnstile field={signUpForm.fields.captchaToken} />
        <div className={styles.tos_agreement_container}>
          <p className={styles.tos_agreement}>
            By clicking on &quot;Sign Up,&quot; I agree to the{' '}
            <Link href="/tos" className="link">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="link">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className={styles.submit_btn_container}>
          <Button type="submit" size="lg" wide disabled={isLoading}>
            Sign Up
          </Button>
        </div>
      </form>
      <div className={styles.sign_in_link_container}>
        <p>
          Already have an account?{' '}
          <Link href="/signin" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </PageContainer>
  );
});
