import type { Badge } from '@/model/types/badges/badge';
import { NumberBadge } from './number-badge';
import styles from './styles.module.scss';
import { isActionBadge } from './is-action-badge';
import { ActionBadge } from './action-badge';
import { isPlayerBadge } from './is-player-badge';
import { PlayerBadge } from './player-badge';

interface BadgesProps {
  badges: (Badge | null)[];
}

/**
 * Renders a component to display all badges
 *
 * @param badges - Array of Badges or null
 *
 * @returns A React component displaying each badge
 *
 * @remarks
 * The array can hold a maximum of 8 badges.
 *
 * The array pushes null values until the length of the array matches 8.
 */
export function Badges({ badges }: BadgesProps): JSX.Element {
  const badgeArray = badges.slice(0, 8);

  while (badgeArray.length < 8) {
    badgeArray.push(null);
  }

  return (
    <section className={styles.section_3}>
      {badgeArray.map((badge, index) => {
        // prettier-ignore
        if (!badge) {
          return <NumberBadge index={index + 1} key={index} />;
        } else if (isActionBadge(badge)) {
          return <ActionBadge badge={badge} index={index + 1} key={index} />;
        } else /* istanbul ignore else */ if (isPlayerBadge(badge)) {
          return <PlayerBadge badge={badge} index={index + 1} key={index} />;
        }
      })}
    </section>
  );
}
