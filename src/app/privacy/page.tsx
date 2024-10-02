import { PageContainer } from '@/components/utils/page-container';
import styles from './styles.module.scss';

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <section className={styles.content}>
        <header>
          <h1>Privacy Policy</h1>
          <p>
            <strong className="b3">Effective Date:</strong> 10/1/2024
          </p>
        </header>
        <ol>
          <li>
            Introduction
            <p>
              This Privacy Policy explains how 8by8 Inc (&quot;we,&quot;
              &quot;our,&quot; or &quot;us&quot;) collects, uses, discloses, and
              protects your information when you use our web application, which
              allows users in the United States to register to vote, sign up for
              election reminders, and invite friends to use the application. By
              using our services, you agree to the collection and use of
              information in accordance with this policy.
            </p>
          </li>
          <li>
            Information We Collect
            <p>We may collect the following information from you:</p>
            <ul>
              <li>
                Personal Information: When you register to vote or sign up for
                election reminders, we may collect personal information such as
                your name, address, email address, phone number, date of birth,
                and other details required for voter registration or election
                reminders.
              </li>
              <li>
                Registration Information: In order to facilitate the
                regeneration of voter registration paperwork, we may store and
                use information required by federal, state, or local election
                authorities.
              </li>
              <li>
                Cookies and Tracking Technologies: We use cookies and similar
                technologies to authenticate users, improve user experience, and
                remember your preferences. Cookies are small text files that are
                stored on your device and may be used for session management,
                analytics, and personalization.
              </li>
            </ul>
          </li>
          <li>
            How We Use Your Information
            <p>We use the information we collect for the following purposes:</p>
            <ul>
              <li>
                To assist you with voter registration and sign up for election
                reminders.
              </li>
              <li>
                To allow for the regeneration of voter registration paperwork.
              </li>
              <li>
                To communicate with you about elections and send reminders based
                on your preferences.
              </li>
              <li>
                To authenticate users and ensure the security of our web
                application.
              </li>
              <li>
                To comply with federal, state, or local laws and regulations.
              </li>
            </ul>
          </li>
          <li>
            Information Sharing and Disclosure
            <p>We may share your information in the following situations:</p>
            <ul>
              <li>
                With Service Providers: We use third-party services, such as
                Rock the Vote, to facilitate voter registration and election
                reminders. These third parties may collect and process your
                personal information in accordance with their own privacy
                policies.
              </li>
              <li>
                Legal Compliance: We may disclose your information if required
                by law or if we believe that such action is necessary to comply
                with legal obligations, protect our rights, or ensure the safety
                of users.
              </li>
            </ul>
          </li>
          <li>
            Cookies and Tracking Technologies
            <p>
              We use cookies and other tracking technologies to improve the
              functionality of our web application, including:
            </p>
            <ul>
              <li>
                Authentication: Cookies help us verify your identity when you
                log in to our web application.
              </li>
              <li>
                Preferences: Cookies store information about your preferences
                and settings.
              </li>
              <li>
                Analytics: We use cookies to track user behavior and gather data
                about how the application is used.
              </li>
            </ul>
            <p>
              You may modify your cookie settings through your browser, but this
              may affect the functionality of the web application.
            </p>
          </li>
          <li>
            Third-Party Services
            <p>
              Our web application integrates with APIs from Rock the Vote, which
              may also collect, process, and store user data. We are not
              responsible for the privacy practices of these third-party
              services, and we encourage you to review their privacy policies.
            </p>
          </li>
          <li>
            Data Security
            <p>
              We take the security of your personal information seriously and
              implement reasonable administrative, technical, and physical
              safeguards to protect your data. However, no method of data
              transmission or storage is 100% secure, and we cannot guarantee
              the absolute security of your information.
            </p>
          </li>
          <li>
            Your Choices
            <p>You may have the following rights regarding your information:</p>
            <ul>
              <li>
                Access: You can access your personal information by logging into
                your account.
              </li>
              <li>
                Opt-Out: You may opt out of receiving election reminders at any
                time by following the unsubscribe instructions included in our
                communications.
              </li>
              <li>
                Cookie Preferences: You can adjust your cookie settings through
                your browser.
              </li>
            </ul>
          </li>
          <li>
            Changes to This Privacy Policy
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be effective immediately upon posting of the revised policy.
              We encourage you to review this page periodically for the latest
              information on our privacy practices.
            </p>
          </li>
        </ol>
      </section>
    </PageContainer>
  );
}
