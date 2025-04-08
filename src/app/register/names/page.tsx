import dynamic from 'next/dynamic';
import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Register to Vote`,
};

/*
  Render the names form on the client side to prevent hydration errors 
  due to reading persistent form data from sessionStorage.
*/
const Names = dynamic(() => import('./names').then(module => module.Names), {
  ssr: false,
});

export default function Page() {
  return <Names />;
}
