import dynamic from 'next/dynamic';
import { FC } from 'react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookMessengerShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  FacebookMessengerIcon,
  EmailIcon,
} from 'react-share';
import { FaInstagram, FaPhoneAlt, FaSms, FaDiscord } from 'react-icons/fa';
import styles from './styles.module.scss';

// Use dynamic import without SSR for react-share library
const SocialShare: FC = () => {
  const shareUrl = 'https://your-website.com'; // Change this to the URL you want to share
  const title = 'Check out this awesome website!';
  const emailBody = 'Check out this awesome website! Visit: ' + shareUrl;

  return (
    <div className={styles.container}>
      {/* Social Media Section */}
      <h2 className={styles.sectionHeading}>Social Media</h2>
      <div className={styles.grid}>
        <div className={styles.group}>
          <FacebookShareButton url={shareUrl}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <p className={styles.iconTitle}>Facebook</p>
        </div>

        <div className={styles.group}>
          <TwitterShareButton url={shareUrl} title={title}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <p className={styles.iconTitle}>Twitter</p>
        </div>

        <div className={styles.group}>
          <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={40} style={{ color: '#E1306C' }} />
          </a>
          <p className={styles.iconTitle}>Instagram</p>
        </div>
      </div>

      {/* Messaging Section */}
      <h2 className={styles.sectionHeading}>Messaging</h2>
      <div className={styles.grid}>
        <div className={styles.group}>
          <WhatsappShareButton url={shareUrl} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <p className={styles.iconTitle}>WhatsApp</p>
        </div>

        <div className={styles.group}>
          <FacebookMessengerShareButton url={shareUrl} appId="your-app-id">
            <FacebookMessengerIcon size={40} round />
          </FacebookMessengerShareButton>
          <p className={styles.iconTitle}>Messenger</p>
        </div>

        <div className={styles.group}>
          <EmailShareButton url={shareUrl} subject={title} body={emailBody}>
            <EmailIcon size={40} round />
          </EmailShareButton>
          <p className={styles.iconTitle}>Email</p>
        </div>

        <div className={styles.group}>
          <a href="sms:+1234567890?body=Check%20out%20this%20awesome%20website!" target="_blank" rel="noopener noreferrer">
            <FaSms size={40} style={{ color: '#34B7F1' }} />
          </a>
          <p className={styles.iconTitle}>Text</p>
        </div>

    

        <div className={styles.group}>
          <a href="https://discord.com/channels/@me" target="_blank" rel="noopener noreferrer">
            <FaDiscord size={40} style={{ color: '#7289DA' }} />
          </a>
          <p className={styles.iconTitle}>Discord</p>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SocialShare), { ssr: false });
