import type { PlayerBadge } from '@/model/types/badges/player-badge';
import { AVATARS } from '@/constants/avatars';
import styles from './styles.module.scss';
import Image from 'next/image';

interface PlayerBadgeProps {
  badge: PlayerBadge;
  index: number;
}

/**
 * Renders a component to display a player badge
 *
 * @param badge - Component's badge data
 *
 * @param index - Index number of badge
 *
 * @returns A React component that displays a badge of a player's name and icon
 */
export function PlayerBadge({ badge, index }: PlayerBadgeProps): JSX.Element {
  const { playerName: name, playerAvatar: avatar } = badge;

  return (
    <div className={styles.badges}>
      <div className={styles.blob}>
        <Image
          alt="player badge background blob"
          className={`${styles.blob_img} ${styles['blob_img_' + index]}`}
          src={require(
            `../../../../public/static/images/pages/progress/badge-${index}-blob.png`,
          )}
        />
      </div>
      <div className={styles.blob_content}>
        <Image
          src={AVATARS[avatar].image}
          alt={AVATARS[avatar].altText}
          className={styles.icon}
        />
        <h3>{name}</h3>
      </div>
    </div>
  );
}
