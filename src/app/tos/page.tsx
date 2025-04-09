import Link from 'next/link';
import { PageContainer } from '@/components/utils/page-container';
import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';
import styles from './styles.module.scss';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Terms of Service`,
};

export default function TermsOfServicePage() {
  return (
    <PageContainer>
      <section className={styles.content}>
        <header>
          <h1>Terms of Service</h1>
          <p>
            <strong className="b3">Effective Date:</strong> 10/1/2024
          </p>
        </header>
        <ol>
          <li>
            Acceptance of Terms
            <p>
              By accessing or using the 8by8 Inc (&quot;we,&quot;
              &quot;our,&quot; or &quot;us&quot;) web application
              (&quot;Service&quot;), you agree to be bound by these Terms of
              Service (&quot;Terms&quot;). If you do not agree to these Terms,
              please do not use the Service.
            </p>
            <p>
              We reserve the right to update or modify these Terms at any time,
              and such changes will be effective immediately upon posting. Your
              continued use of the Service after changes are made constitutes
              your acceptance of the new Terms.
            </p>
          </li>
          <li>
            Use of the Service
            <p>Our Service allows users in the United States to:</p>
            <ul>
              <li>Register to vote.</li>
              <li>Sign up for election reminders.</li>
              <li>Generate voter registration paperwork, if needed.</li>
              <li>Invite friends to use the Service.</li>
              <li>
                Earn badges for actions such as registering to vote, signing up
                for election reminders, and inviting friends to participate.
                Users receive badges when they or their friends complete certain
                actions. When a user earns 8 badges, they complete the
                challenge, although no tangible rewards are currently offered
                for completing the challenge.
              </li>
            </ul>
            <p>By using the Service, you agree to:</p>
            <ul>
              <li>
                Provide accurate, current, and complete information during
                registration and while using the Service.
              </li>
              <li>
                Use the Service in accordance with applicable federal, state,
                and local laws.
              </li>
              <li>
                Not use the Service for any unlawful, abusive, or unauthorized
                purposes.
              </li>
            </ul>
            <p>
              We reserve the right to suspend or terminate your access to the
              Service at any time, without notice, for any reason, including but
              not limited to a violation of these Terms.
            </p>
          </li>
          <li>
            Eligibility
            <p>
              You are eligible to use the Service if you are a U.S. citizen and
              are at least 18 years old or meet the minimum pre-registration age
              requirement in your state. By using the Service, you represent and
              warrant that you meet these eligibility requirements. For more
              information on state-specific pre-registration ages, please visit{' '}
              <a
                href="https://www.rockthevote.org/how-to-vote/nationwide-voting-info/voter-pre-registration/"
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                this page.
              </a>
            </p>
          </li>
          <li>
            Registration and Account Security
            <p>
              To use certain features of the Service, such as voter registration
              and election reminders, you may be required to create an account.
              When you create an account, you agree to:
            </p>
            <ul>
              <li>Keep your login credentials confidential.</li>
              <li>
                Notify us immediately of any unauthorized use of your account or
                any other breach of security.
              </li>
              <li>
                Be responsible for all activities that occur under your account.
              </li>
            </ul>
            <p>
              We are not liable for any loss or damage arising from your failure
              to comply with these security obligations.
            </p>
          </li>
          <li>
            Third-Party Services
            <p>
              We use third-party services, including but not limited to Rock the
              Vote for voter registration and reminders, and Supabase for
              authentication and database management. By using these third-party
              services through our Service, you agree to comply with their terms
              and conditions. We are not responsible for the availability,
              accuracy, or content of third-party services, nor do we endorse or
              assume liability for any third-party services.
            </p>
          </li>
          <li>
            Privacy
            <p>
              Your use of the Service is subject to our{' '}
              <Link href="/privacy" className="link">
                Privacy Policy
              </Link>
              , which explains how we collect, use, and protect your personal
              information. By using the Service, you agree to the terms of the
              Privacy Policy.
            </p>
          </li>
          <li>
            Intellectual Property
            <p>
              All content, including text, graphics, logos, and software,
              available through the Service is the property of 8by8 Inc or its
              licensors and is protected by intellectual property laws. You may
              not reproduce, distribute, modify, or create derivative works from
              any part of the Service without our prior written consent.
            </p>
          </li>
          <li>
            Limitation of Liability
            <p>
              To the fullest extent permitted by law, 8by8 Inc and its officers,
              directors, employees, and agents will not be liable for any
              direct, indirect, incidental, special, or consequential damages
              arising from:
            </p>
            <ul>
              <li>Your use or inability to use the Service.</li>
              <li>Any unauthorized access to or use of your account.</li>
              <li>Any interruptions or errors in the Service.</li>
              <li>The actions or content of any third-party services.</li>
            </ul>
            <p>
              Some jurisdictions do not allow the exclusion of certain
              warranties or limitation of liability for damages. In such
              jurisdictions, our liability will be limited to the maximum extent
              permitted by law.
            </p>
          </li>
          <li>
            Indemnification
            <p>
              You agree to indemnify, defend, and hold harmless 8by8 Inc and its
              officers, directors, employees, and agents from any claims,
              damages, liabilities, losses, or expenses (including reasonable
              attorney fees) arising out of your use of the Service, your
              violation of these Terms, or your violation of any third-party
              rights.
            </p>
          </li>
          <li>
            Termination
            <p>
              We reserve the right to terminate or suspend your account and
              access to the Service at any time, without notice, for any reason,
              including but not limited to a violation of these Terms. Upon
              termination, you must immediately cease all use of the Service.
            </p>
          </li>
          <li>
            Governing Law
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the State of California, without regard to its conflict of
              laws principles. You agree to submit to the exclusive jurisdiction
              of the courts located in California for any legal action or
              proceeding related to these Terms or your use of the Service.
            </p>
          </li>
          <li>
            Entire Agreement
            <p>
              These Terms, along with our{' '}
              <Link href="/privacy" className="link">
                Privacy Policy
              </Link>
              , constitute the entire agreement between you and 8by8 Inc
              regarding the use of the Service and supersede any prior
              agreements or understandings.
            </p>
          </li>
          <li>
            Contact Information
            <p>
              If you have any questions or concerns about these Terms, please
              contact us at{' '}
              <a href="mailto:info@8by8.us" className="link">
                info@8by8.us
              </a>
              .
            </p>
          </li>
        </ol>
      </section>
    </PageContainer>
  );
}
