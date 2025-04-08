import dynamic from 'next/dynamic';
import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Register to Vote`,
};

/*
  Render the addresses form on the client side to prevent hydration errors 
  due to reading persistent form data from sessionStorage.
*/
const Addresses = dynamic(
  () => import('./addresses').then(module => module.Addresses),
  {
    ssr: false,
  },
);

export default function Page() {
  return <Addresses />;
}
