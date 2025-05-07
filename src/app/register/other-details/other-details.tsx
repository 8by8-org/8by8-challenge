'use client';
import { hasNotCompletedAction } from '@/components/guards/has-not-completed-action';
import { Actions } from '@/model/enums/actions';
import { useState, useId } from 'react';
import { useValue, ValidityUtils } from 'fully-formed';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { useContextSafely } from '@/hooks/use-context-safely';
import { VoterRegistrationContext } from '../voter-registration-context';
import { UserContext } from '@/contexts/user-context';
import { AlertsContext } from '@/contexts/alerts-context';
import { Select } from '@/components/form-components/select';
import { Checkbox } from '@/components/form-components/checkbox';
import { ExcludableContent } from '@/components/form-components/excludable-content/excludable-content';
import { InputGroup } from '@/components/form-components/input-group';
import { Button } from '@/components/utils/button';
import { Input } from '@/components/form-components/input';
import { Label } from '@/components/form-components/label';
import { LoadingWheel } from '@/components/utils/loading-wheel';
import { getFirstNonValidInputId } from './get-first-non-valid-input-id';
import { focusOnElementById } from '@/utils/client/focus-on-element-by-id';
import { sendAnalyticsEvent } from '@/analytics/send-analytics-event';
import { AnalyticsEventType } from '@/analytics/analytics-event-type';
import { getInvalidFieldNames } from '@/utils/client/get-invalid-field-names';
import type { FormEventHandler } from 'react';
import type { PoliticalPartiesAndOtherDetails } from '@/model/types/political-parties-and-other-details';
import styles from './styles.module.scss';

export const OtherDetails = hasNotCompletedAction(
  function OtherDetails({
    politicalParties,
    raceOptions,
    idNumberMessage,
  }: PoliticalPartiesAndOtherDetails) {
    const { voterRegistrationForm } = useContextSafely(
      VoterRegistrationContext,
      'OtherDetails',
    );
    const otherDetailsForm = voterRegistrationForm.fields.otherDetails;
    const idFieldDescriptionId = useId();
    const { registerToVote } = useContextSafely(UserContext, 'OtherDetails');
    const { showAlert } = useContextSafely(AlertsContext, 'OtherDetails');
    const [isSubmitting, setIsSubmitting] = useState(false);
    useScrollToTop();

    const onSubmit: FormEventHandler<HTMLFormElement> = async e => {
      e.preventDefault();
      if (isSubmitting) return;

      otherDetailsForm.setSubmitted();

      if (!ValidityUtils.isValid(otherDetailsForm)) {
        const firstNonValidInputId = getFirstNonValidInputId(otherDetailsForm);
        firstNonValidInputId && focusOnElementById(firstNonValidInputId);
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId: otherDetailsForm.id,
          formName: otherDetailsForm.name,
          succeeded: false,
          invalidFields: getInvalidFieldNames(otherDetailsForm),
        });
        return;
      }

      try {
        setIsSubmitting(true);
        await registerToVote(voterRegistrationForm.state.value);
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId: otherDetailsForm.id,
          formName: otherDetailsForm.name,
          succeeded: true,
        });
      } catch (e) {
        setIsSubmitting(false);
        showAlert('Something went wrong. Please try again.', 'error');
        sendAnalyticsEvent(AnalyticsEventType.FormSubmit, {
          formId: otherDetailsForm.id,
          formName: otherDetailsForm.name,
          succeeded: false,
        });
      }
    };

    return (
      <form
        id={otherDetailsForm.id}
        name={otherDetailsForm.name}
        onSubmit={onSubmit}
      >
        <h2 className="mb_sm">Other Details</h2>
        <Select
          field={otherDetailsForm.fields.party}
          label="Political party*"
          options={politicalParties.map(party => ({
            text: party,
            value: party,
          }))}
          className={styles.select}
          aria-required
        />
        <ExcludableContent excludableField={otherDetailsForm.fields.otherParty}>
          <InputGroup
            field={otherDetailsForm.fields.otherParty}
            type="text"
            labelVariant="floating"
            labelContent="If other, please specify*"
            containerClassName={styles.other_party}
            aria-required
          />
        </ExcludableContent>
        <Select
          field={otherDetailsForm.fields.race}
          label="Race*"
          options={raceOptions.map(value => {
            return {
              text: value,
              value,
            };
          })}
          className={styles.race}
          moreInfo={{
            buttonAltText:
              'Click for more details about why we collect this information',
            dialogAriaLabel:
              'More details about why we collect this information',
            infoComponent: (
              <p>
                We appreciate this information in order to measure the
                effectiveness of our voter registration efforts. Additionally,
                this information is required by some states.
              </p>
            ),
          }}
          aria-required
        />
        <Checkbox
          checked={useValue(otherDetailsForm.fields.hasStateLicenseOrID)}
          onChange={e =>
            otherDetailsForm.fields.hasStateLicenseOrID.setValue(
              e.target.checked,
            )
          }
          name={otherDetailsForm.fields.hasStateLicenseOrID.name}
          labelContent="I have a state-issued driver's license or ID card"
          containerClassName={styles.mb_16}
        />
        <Label field={otherDetailsForm.fields.idNumber} variant="floating">
          ID number*
        </Label>
        <Input
          field={otherDetailsForm.fields.idNumber}
          type="text"
          aria-required
          aria-describedby={idFieldDescriptionId}
        />
        <p className="mb_md" id={idFieldDescriptionId}>
          {idNumberMessage}
        </p>
        <Checkbox
          checked={useValue(otherDetailsForm.fields.receiveEmailsFromRTV)}
          onChange={e =>
            otherDetailsForm.fields.receiveEmailsFromRTV.setValue(
              e.target.checked,
            )
          }
          name={otherDetailsForm.fields.receiveEmailsFromRTV.name}
          labelContent="I'd like to receive emails from Rock the Vote"
          containerClassName={styles.mb_16}
        />
        <Checkbox
          checked={useValue(otherDetailsForm.fields.receiveSMSFromRTV)}
          onChange={e =>
            otherDetailsForm.fields.receiveSMSFromRTV.setValue(e.target.checked)
          }
          name={otherDetailsForm.fields.receiveSMSFromRTV.name}
          labelContent="I'd like to receive SMS messages from Rock the Vote"
          containerClassName="mb_md"
        />
        <Button type="submit" size="lg" wide className="mb_lg">
          Submit
        </Button>
        {isSubmitting && <LoadingWheel />}
      </form>
    );
  },
  { redirectTo: '/register/completed', action: Actions.RegisterToVote },
);
