'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VoterRegistrationPathnames } from '../../constants/voter-registration-pathnames';
import { Modal } from '@/components/utils/modal';
import { ReviewRecommendedAddress } from './review-recommended-address';
import { MissingSubpremise } from './missing-subpremise';
import { UnconfirmedComponents } from './unconfirmed-components';
import { ReviewAddresses } from './review-addresses';
import { AddressErrorTypes } from '@/model/types/addresses/address-error-types';
import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import type { AddressesForm } from '../addresses-form';
import type { AddressErrors } from '@/model/types/addresses/address-errors';

interface AddressConfirmationModalProps {
  addressesForm: InstanceType<typeof AddressesForm>;
  errors: AddressErrors[];
  returnToEditing: () => void;
}

export function AddressConfirmationModal({
  addressesForm,
  errors,
  returnToEditing,
}: AddressConfirmationModalProps) {
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const router = useRouter();

  const continueToNextPage = () => {
    router.push(
      VoterRegistrationPathnames.OTHER_DETAILS +
        `?state=${addressesForm.state.value.homeAddress.state}`,
    );
    sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
      formId: addressesForm.id,
      formName: addressesForm.name,
      succeeded: true,
    });
  };

  const nextOrContinue = () => {
    if (currentErrorIndex < errors.length - 1) {
      setCurrentErrorIndex(currentErrorIndex + 1);
    } else {
      continueToNextPage();
    }
  };

  return (
    <Modal
      ariaLabel="Correct address validation errors"
      theme="light"
      isOpen={!!errors.length}
      closeModal={returnToEditing}
    >
      {(() => {
        const error = errors[currentErrorIndex];

        switch (error.type) {
          case AddressErrorTypes.UnconfirmedComponents:
            return (
              <UnconfirmedComponents
                unconfirmedComponents={error.unconfirmedAddressComponents}
                errorNumber={currentErrorIndex + 1}
                errorCount={errors.length}
                returnToEditing={returnToEditing}
                nextOrContinue={nextOrContinue}
              />
            );
          case AddressErrorTypes.ReviewRecommendedAddress:
            return (
              <ReviewRecommendedAddress
                enteredAddress={error.enteredAddress}
                recommendedAddress={error.recommendedAddress}
                form={addressesForm.fields[error.form]}
                errorNumber={currentErrorIndex + 1}
                errorCount={errors.length}
                nextOrContinue={nextOrContinue}
              />
            );
          case AddressErrorTypes.MissingSubpremise:
            return (
              <MissingSubpremise
                form={addressesForm.fields[error.form]}
                errorNumber={currentErrorIndex + 1}
                errorCount={errors.length}
                nextOrContinue={nextOrContinue}
              />
            );
          case AddressErrorTypes.ValidationFailed:
            return (
              <ReviewAddresses
                homeAddress={addressesForm.state.value.homeAddress}
                mailingAddress={addressesForm.state.value.mailingAddress}
                previousAddress={addressesForm.state.value.previousAddress}
                returnToEditing={returnToEditing}
                continueToNextPage={continueToNextPage}
              />
            );
        }
      })()}
    </Modal>
  );
}
