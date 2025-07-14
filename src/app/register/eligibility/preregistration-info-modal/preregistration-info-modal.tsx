'use client';
import { useRouter } from 'next/navigation';
import { usePipe, type FieldOfType } from 'fully-formed';
import { Modal } from '@/components/utils/modal';
import { Button } from '@/components/utils/button';
import zipState from 'zip-state';
import { getPreregistrationInfo } from '../utils/get-preregistration-info';
import { VoterRegistrationPathnames } from '../../constants/voter-registration-pathnames';
import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import { EligibilityForm } from '../eligibility-form';
import type { Dispatch, SetStateAction } from 'react';
import styles from './styles.module.scss';

interface PreregistrationInfoModalProps {
  zipCodeField: FieldOfType<string>;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  parentFormId: string; // for analytics
  parentFormName: string; // for analytics
}

/**
 * A modal that displays state-specific information about preregistering to vote.
 * Intended to be displayed to users if they are under 18 years of age.
 *
 * @param props - {@link PreregistrationInfoModalProps}
 */
export function PreregistrationInfoModal({
  zipCodeField,
  showModal,
  setShowModal,
  parentFormId,
  parentFormName,
}: PreregistrationInfoModalProps) {
  const router = useRouter();
  const state = usePipe(zipCodeField, ({ value }) => zipState(value));
  const preregistrationInformation = getPreregistrationInfo(state);

  const closeModal = () => setShowModal(false);

  const keepGoing = () => {
    router.push(VoterRegistrationPathnames.NAMES);
    sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
      formId: parentFormId,
      formName: parentFormName,
      succeeded: true,
    });
  };

  return (
    <Modal
      ariaLabel={`Preregistration requirements for ${state}`}
      theme="light"
      isOpen={showModal}
      closeModal={closeModal}
    >
      <h3 className={styles.title}>
        Hey there!
        <br />
        Looks like you&apos;re not 18 yet.
      </h3>
      <p>{preregistrationInformation}</p>
      <div className={styles.buttons_container}>
        <Button
          type="button"
          onClick={keepGoing}
          className={styles.button}
          variant="inverted"
          size="sm"
        >
          Keep Going
        </Button>
        <Button
          type="button"
          onClick={closeModal}
          className={styles.button}
          variant="inverted"
          size="sm"
        >
          Nevermind
        </Button>
      </div>
    </Modal>
  );
}
