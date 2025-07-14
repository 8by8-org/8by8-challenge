import dynamic from 'next/dynamic';
import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Share Your Challenge`,
};

const Share = dynamic(() => import('./share').then(module => module.Share), {
  ssr: false,
});

export default function Page() {
  return <Share />;
}
