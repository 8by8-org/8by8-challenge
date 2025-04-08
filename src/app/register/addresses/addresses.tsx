'use client';
import { hasNotCompletedAction } from '@/components/guards/has-not-completed-action';
import { Actions } from '@/model/enums/actions';
import { useState } from 'react';
import { useExclude, ValidityUtils } from 'fully-formed';
import { useRouter } from 'next/navigation';
import { useContextSafely } from '@/hooks/use-context-safely';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { usePrefetchOtherDetailsWithState } from './hooks/use-prefetch-other-details-with-state';
import { VoterRegistrationContext } from '../voter-registration-context';
import { VoterRegistrationPathnames } from '../constants/voter-registration-pathnames';
import { HomeAddress } from './home-address';
import { Checkbox } from '@/components/form-components/checkbox';
import { ExcludableContent } from '@/components/form-components/excludable-content/excludable-content';
import { MailingAddress } from './mailing-address';
import { PreviousAddress } from './previous-address';
import { Button } from '@/components/utils/button';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { AddressConfirmationModal } from './address-confirmation-modal';
import { getFirstNonValidInputId } from './utils/get-first-nonvalid-input-id';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';
import { validateAddresses } from './utils/validate-addresses';
import { applyCautionValidityToFormFields } from './utils/apply-caution-validity-to-form-fields';
import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import { getInvalidFieldNames } from '@/utils/client/get-invalid-field-names';
import type { FormEventHandler } from 'react';
import type { AddressErrors } from '@/model/types/addresses/address-errors';
import styles from './styles.module.scss';

export const Addresses = hasNotCompletedAction(
  function Addresses() {
    const { voterRegistrationForm } = useContextSafely(
      VoterRegistrationContext,
      'Addresses',
    );
    const addressesForm = voterRegistrationForm.fields.addresses;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<AddressErrors[]>([]);

    useScrollToTop();
    usePrefetchOtherDetailsWithState(addressesForm.fields.homeAddress);

    const onSubmit: FormEventHandler = async e => {
      e.preventDefault();
      if (isLoading) return;

      addressesForm.setSubmitted();

      if (!ValidityUtils.isValidOrCaution(addressesForm)) {
        const firstNonValidInputId = getFirstNonValidInputId(addressesForm);
        firstNonValidInputId && focusOnElementById(firstNonValidInputId);
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId: addressesForm.id,
          formName: addressesForm.name,
          succeeded: false,
          invalidFields: getInvalidFieldNames(addressesForm),
        });
        return;
      }

      setIsLoading(true);
      const errors = await validateAddresses(addressesForm.state.value);

      if (errors.length) {
        setIsLoading(false);
        setErrors(errors);
        applyCautionValidityToFormFields(addressesForm, errors);
      } else {
        router.push(
          VoterRegistrationPathnames.OTHER_DETAILS +
            `?state=${addressesForm.state.value.homeAddress.state}`,
        );
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId: addressesForm.id,
          formName: addressesForm.name,
          succeeded: true,
        });
      }
    };

    const returnToEditing = () => {
      setErrors([]);
      const firstNonValidInputId = getFirstNonValidInputId(addressesForm);
      firstNonValidInputId && focusOnElementById(firstNonValidInputId);
    };

    return (
      <form id={addressesForm.id} name={addressesForm.name} onSubmit={onSubmit}>
        {isLoading && <LoadingWheel />}
        <HomeAddress />
        <Checkbox
          checked={!useExclude(addressesForm.fields.mailingAddress)}
          onChange={e => {
            addressesForm.fields.mailingAddress.setExclude(!e.target.checked);
          }}
          labelContent="I get my mail at a different address from the one above"
          name="hasMailingAddress"
          containerClassName={
            useExclude(addressesForm.fields.mailingAddress) ?
              styles.has_mailing_address_unchecked
            : styles.has_mailing_address_checked
          }
        />
        <ExcludableContent
          excludableField={addressesForm.fields.mailingAddress}
        >
          <MailingAddress />
        </ExcludableContent>
        <Checkbox
          checked={!useExclude(addressesForm.fields.previousAddress)}
          onChange={e => {
            addressesForm.fields.previousAddress.setExclude(!e.target.checked);
          }}
          labelContent="I've changed my address since the last time I registered to vote"
          name="hasPreviousAddress"
          containerClassName="mb_md"
        />
        <ExcludableContent
          excludableField={addressesForm.fields.previousAddress}
        >
          <PreviousAddress />
        </ExcludableContent>
        <Button type="submit" size="lg" wide className="mb_lg">
          Next
        </Button>
        {!!errors.length && (
          <AddressConfirmationModal
            addressesForm={addressesForm}
            errors={errors}
            returnToEditing={returnToEditing}
          />
        )}
      </form>
    );
  },
  { redirectTo: '/register/completed', action: Actions.RegisterToVote },
);
