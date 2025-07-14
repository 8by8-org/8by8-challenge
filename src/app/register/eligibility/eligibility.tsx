'use client';
import { hasNotCompletedAction } from '@/components/guards/has-not-completed-action';
import { Actions } from '@/model/enums/actions';
import { useState, type FormEventHandler } from 'react';
import { useRouter } from 'next/navigation';
import { ValidityUtils, usePipe, useValidity, useValue } from 'fully-formed';
import zipState from 'zip-state';
import { DateTime } from 'luxon';
import { useContextSafely } from '@/hooks/use-context-safely';
import { usePrefetch } from '@/hooks/use-prefetch';
import { VoterRegistrationContext } from '../voter-registration-context';
import { VoterRegistrationPathnames } from '../constants/voter-registration-pathnames';
import { Label } from '@/components/form-components/label';
import { Checkbox } from '@/components/form-components/checkbox';
import { InputGroup } from '@/components/form-components/input-group';
import { Messages } from '@/components/form-components/messages';
import { Button } from '@/components/utils/button';
import { PreregistrationInfoModal } from './preregistration-info-modal';
import { StateInformationModal } from './state-information-modal';
import { US_STATE_ABBREVIATIONS } from '@/constants/us-state-abbreviations';
import { calculateAge } from './utils/calculate-age';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';
import { getFirstNonValidInputId } from './utils/get-first-non-valid-input-id';
import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import { getInvalidFieldNames } from '@/utils/client/get-invalid-field-names';
import styles from './styles.module.scss';

export const Eligibility = hasNotCompletedAction(
  function Eligibility() {
    const { voterRegistrationForm } = useContextSafely(
      VoterRegistrationContext,
      'Eligibility',
    );
    const eligibilityForm = voterRegistrationForm.fields.eligibility;
    const stateAbbr = usePipe(eligibilityForm.fields.zip, ({ value }) => {
      return zipState(value) ?? '';
    });
    const [showPreregistrationInfoModal, setShowPreregistrationInfoModal] =
      useState(false);
    const [showStateInformationModal, setShowStateInformationModal] =
      useState(false);

    const router = useRouter();
    usePrefetch(VoterRegistrationPathnames.NAMES);

    const onSubmit: FormEventHandler<HTMLFormElement> = e => {
      e.preventDefault();
      eligibilityForm.setSubmitted();

      if (!ValidityUtils.isValid(eligibilityForm)) {
        const firstNonValidInputId = getFirstNonValidInputId(eligibilityForm);
        firstNonValidInputId && focusOnElementById(firstNonValidInputId);
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId: eligibilityForm.id,
          formName: eligibilityForm.name,
          succeeded: false,
          invalidFields: getInvalidFieldNames(eligibilityForm),
        });
        return;
      }

      if (
        stateAbbr === US_STATE_ABBREVIATIONS.NORTH_DAKOTA ||
        stateAbbr === US_STATE_ABBREVIATIONS.NEW_HAMPSHIRE ||
        stateAbbr === US_STATE_ABBREVIATIONS.WYOMING
      ) {
        setShowStateInformationModal(true);
      } else if (calculateAge(eligibilityForm.fields.dob.state.value) < 18) {
        setShowPreregistrationInfoModal(true);
      } else {
        router.push(VoterRegistrationPathnames.NAMES);
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId: eligibilityForm.id,
          formName: eligibilityForm.name,
          succeeded: true,
        });
      }
    };

    return (
      <form
        id={eligibilityForm.id}
        name={eligibilityForm.name}
        onSubmit={onSubmit}
      >
        <p className="mb_md">
          Registering to vote is easy, and only takes a few minutes!
        </p>
        <h2 className="mb_sm">Eligibility</h2>
        <Label field={eligibilityForm.fields.email} variant="stationary">
          Email
        </Label>
        <input
          name={eligibilityForm.fields.email.name}
          id={eligibilityForm.fields.email.id}
          value={useValue(eligibilityForm.fields.email)}
          type="email"
          readOnly
          aria-readonly
          className={styles.readonly_input}
        />
        <InputGroup
          type="text"
          field={eligibilityForm.fields.zip}
          labelVariant="floating"
          labelContent="Zip Code*"
          maxLength={5}
          containerClassName={styles.zip_code}
          aria-required
        />
        <InputGroup
          type="date"
          field={eligibilityForm.fields.dob}
          labelVariant="floating"
          labelContent="Date of Birth*"
          containerClassName="mb_md"
          max={DateTime.now().toFormat('yyyy-MM-dd')}
          aria-required
        />
        <Checkbox
          name={eligibilityForm.fields.eighteenPlus.name}
          id={eligibilityForm.fields.eighteenPlus.id}
          aria-required
          aria-describedby={`${eligibilityForm.fields.eighteenPlus.id}-messages`}
          aria-invalid={ValidityUtils.isInvalid(
            useValidity(eligibilityForm.fields.eighteenPlus),
          )}
          checked={useValue(eligibilityForm.fields.eighteenPlus)}
          onChange={e => {
            eligibilityForm.fields.eighteenPlus.setValue(e.target.checked);
          }}
          labelContent="I will be 18 years-old or older by the next election.*"
        />
        <Messages
          id={`${eligibilityForm.fields.eighteenPlus.id}-messages`}
          messageBearers={[eligibilityForm.fields.eighteenPlus]}
          hideMessages={usePipe(eligibilityForm.fields.eighteenPlus, state => {
            return !(
              state.hasBeenBlurred ||
              state.hasBeenModified ||
              state.submitted
            );
          })}
          containerClassName={styles.checkbox_messages}
        />
        <Checkbox
          name={eligibilityForm.fields.isCitizen.name}
          id={eligibilityForm.fields.isCitizen.id}
          aria-required
          aria-describedby={`${eligibilityForm.fields.isCitizen.id}-messages`}
          aria-invalid={ValidityUtils.isInvalid(
            useValidity(eligibilityForm.fields.isCitizen),
          )}
          checked={useValue(eligibilityForm.fields.isCitizen)}
          onChange={e => {
            eligibilityForm.fields.isCitizen.setValue(e.target.checked);
          }}
          labelContent="I am a US citizen.*"
        />
        <Messages
          id={`${eligibilityForm.fields.isCitizen.id}-messages`}
          messageBearers={[eligibilityForm.fields.isCitizen]}
          hideMessages={usePipe(eligibilityForm.fields.isCitizen, state => {
            return !(
              state.hasBeenBlurred ||
              state.hasBeenModified ||
              state.submitted
            );
          })}
          containerClassName={styles.checkbox_messages}
        />
        <Checkbox
          name={eligibilityForm.fields.firstTimeRegistrant.name}
          id={eligibilityForm.fields.firstTimeRegistrant.id}
          checked={useValue(eligibilityForm.fields.firstTimeRegistrant)}
          onChange={e => {
            eligibilityForm.fields.firstTimeRegistrant.setValue(
              e.target.checked,
            );
          }}
          labelContent="This is my first time registering to vote"
          containerClassName={styles.first_time_registrant}
        />
        <Button type="submit" size="lg" wide className="mb_lg">
          Get Started
        </Button>
        {showStateInformationModal && (
          <StateInformationModal
            stateAbbr={stateAbbr}
            showModal={showStateInformationModal}
            setShowModal={setShowPreregistrationInfoModal}
            parentFormId={eligibilityForm.id}
            parentFormName={eligibilityForm.name}
          />
        )}
        {showPreregistrationInfoModal && (
          <PreregistrationInfoModal
            zipCodeField={eligibilityForm.fields.zip}
            showModal={showPreregistrationInfoModal}
            setShowModal={setShowPreregistrationInfoModal}
            parentFormId={eligibilityForm.id}
            parentFormName={eligibilityForm.name}
          />
        )}
      </form>
    );
  },
  { redirectTo: '/register/completed', action: Actions.RegisterToVote },
);
