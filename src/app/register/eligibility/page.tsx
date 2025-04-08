import dynamic from 'next/dynamic';
import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Register to Vote`,
};

/*
  Render the eligibility form on the client side to prevent hydration errors 
  due to reading persistent form data from sessionStorage.
*/
const Eligibility = dynamic(
  () => import('./eligibility').then(module => module.Eligibility),
  {
    ssr: false,
  },
);

export default function Page() {
  return <Eligibility />;
}
