'use client';
import { isSignedIn } from '@/components/guards/is-signed-in';
import { PageContainer } from '@/components/utils/page-container';
import { PledgeToVoteForm } from './pledge-to-vote-form';
import { hasNotCompletedAction } from '@/components/guards/has-not-completed-action';
import { Actions } from '@/model/enums/actions';
import styles from './styles.module.scss';

export default isSignedIn(
  hasNotCompletedAction(
    function Page() {
      return (
        <PageContainer>
          <h1 className={styles.title}>
            <span className="underline">Get Elec</span>tion
            <br />
            Alerts
          </h1>
          <PledgeToVoteForm />
        </PageContainer>
      );
    },
    { action: Actions.ElectionReminders, redirectTo: '/reminders/completed' },
  ),
);
