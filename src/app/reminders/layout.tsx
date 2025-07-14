import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Get Election Reminders`,
};

export default function Layout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
