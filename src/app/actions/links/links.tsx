'use client';
import React from 'react';
import Link from 'next/link';
import { useContextSafely } from '@/hooks/use-context-safely';
import { UserContext } from '@/contexts/user-context';
import { hasCompletedMultipleActions } from '../utils/has-completed-multiple-actions';
import { hasCompletedAllActions } from '../utils/has-completed-all-actions';
import { lastContributedToCurrentInviter } from '../utils/last-contributed-to-current-inviter';
import { UserType } from '@/model/enums/user-type';
import styles from './styles.module.scss';

export function Links() {
  const { user, invitedBy } = useContextSafely(UserContext, 'Links');

  if (hasCompletedAllActions(user)) {
    return null;
  }

  const links: React.JSX.Element[] = [];

  // prettier-ignore
  if (
    invitedBy &&
    lastContributedToCurrentInviter(user?.contributedTo, invitedBy)
  ) {
    if (hasCompletedMultipleActions(user)) {
      links.push(<p>Thanks for your actions!</p>);
      links.push(
        <Link href="/share" className="link--teal">
          Share about your actions
        </Link>,
      );
    } else if (
      user?.completedActions.electionReminders ||
      user?.completedActions.registerToVote
    ) {
      if (user?.completedActions.electionReminders) {
        links.push(<p>Thanks for getting election reminders!</p>);
      }

      if (user?.completedActions.registerToVote) {
        links.push(<p>Thanks for registering to vote!</p>);
      }

      links.push(
        <Link href="/share" className="link--teal">
          Share about your action
        </Link>,
      );
    } else if (user?.type === UserType.Hybrid) {
      links.push(<p>Thanks for taking the challenge!</p>);
    }
  } else /* istanbul ignore else */ if (user?.type === UserType.Hybrid) {
    links.push(<p>Here for something else?</p>);
  }

  if (user?.type === UserType.Hybrid) {
    links.push(
      <Link href="/progress" className="link--teal">
        See your progress
      </Link>,
    );
  }

  return <div className={styles.container}>{...links}</div>;
}
