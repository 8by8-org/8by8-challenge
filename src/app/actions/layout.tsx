import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Actions`,
};

export default function Layout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
