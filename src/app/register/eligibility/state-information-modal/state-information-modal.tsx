'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Modal } from '@/components/utils/modal';
import { Button } from '@/components/utils/button';
import { VoterRegistrationPathnames } from '../../constants/voter-registration-pathnames';
import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import type { Dispatch, SetStateAction } from 'react';
import styles from './styles.module.scss';

interface StateInformationModalProps {
  stateAbbr: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  parentFormId: string; // for analytics
  parentFormName: string; // for analytics
}

/**
 * A modal that displays information voting in North Dakota, New Hampshire and
 * Wyoming, as the laws in these states have special regulations when it comes
 * to registering to vote.
 *
 * @param props - {@link StateInformationModalProps}
 */
export function StateInformationModal({
  stateAbbr,
  showModal,
  setShowModal,
  parentFormId,
  parentFormName,
}: StateInformationModalProps) {
  const router = useRouter();
  const closeModal = () => setShowModal(false);

  const keepGoing = () => {
    router.push(VoterRegistrationPathnames.NAMES);
    sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
      formId: parentFormId,
      formName: parentFormName,
      succeeded: true,
    });
  };

  const state =
    stateAbbr === 'ND' ? 'North Dakota'
    : stateAbbr === 'NH' ? 'New Hampshire'
    : stateAbbr === 'WY' ? 'Wyoming'
    : stateAbbr;

  return (
    <Modal
      ariaLabel={`Voting in ${state}`}
      theme="light"
      isOpen={showModal}
      closeModal={closeModal}
    >
      <h3 className={styles.title}>
        Hey there! Looks like you&apos;re from {state}.
      </h3>
      {(() => {
        switch (stateAbbr) {
          case 'ND':
            return (
              <p>
                North Dakota does not require voter registration. For more
                information on voting in North Dakota, please see{' '}
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={
                    'https://www.sos.nd.gov/elections/voter/voting-north-dakota'
                  }
                  className="link"
                >
                  Voting in North Dakota
                </Link>
                .
              </p>
            );
          case 'NH':
            return (
              <>
                <p>
                  New Hampshire law does not allow you to use this form to
                  register to vote.
                </p>
                <br />
                <p>
                  For information about registering to vote, contact your{' '}
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={'https://app.sos.nh.gov/clerkinformation'}
                    className="link"
                  >
                    town or city clerk
                  </Link>
                  , or your{' '}
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.sos.nh.gov/elections/information/contact"
                    className="link"
                  >
                    Secretary of State
                  </Link>
                  .
                </p>
              </>
            );
          case 'WY':
            return (
              <>
                <p>
                  Wyoming law does not allow you to use this form to register to
                  vote. For information about registering to vote, please
                  contact the county clerk where you live.
                </p>
                <br />
                <p>
                  Contact information can be found{' '}
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href="http://soswy.state.wy.us/Elections/RegisteringToVote.aspx"
                    className="link"
                  >
                    here
                  </Link>
                  .
                </p>
              </>
            );
          default:
            return null;
        }
      })()}

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
