import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Sign up`,
};

export default function Layout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
