import { AlertsContextProvider } from '@/contexts/alerts-context';
import { UserContextProvider } from '@/contexts/user-context/user-context-provider';
import { Header } from '@/components/header';
import { RestartChallengeModal } from '@/contexts/user-context/restart-challenge-modal';
import { Footer } from '@/components/footer';
import { bebasNeue } from '@/fonts/bebas-neue';
import { lato } from '@/fonts/lato';
import { AnalyticsProvider } from '@/analytics/analytics-provider';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/main.scss';

interface RootLayoutProps {
  children?: ReactNode;
}

export const metadata: Metadata = {
  title: '8by8 Challenge',
  description:
    'Join us in promoting civic engagement to combat hate against the AAPI community. Register to vote, sign up for election reminders, and share your challenge to earn badges. Together, we can make a difference! Made by 8by8.us with ❤️',
  openGraph: {
    images: {
      url: '/static/images/open-graph/thumbnail.png',
      height: 1337,
      width: 1337,
    },
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${bebasNeue.variable} ${lato.variable}`}>
        <AlertsContextProvider>
          <UserContextProvider>
            <Header />
            {children}
            <RestartChallengeModal />
            <Footer />
          </UserContextProvider>
        </AlertsContextProvider>
        <AnalyticsProvider />
      </body>
    </html>
  );
}
