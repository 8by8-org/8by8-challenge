import Image from 'next/image';
import { PageContainer } from '@/components/utils/page-container';
import notFound from '@/../public/static/images/pages/not-found/404.png';
import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';
import styles from './not-found.module.scss';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Page Not Found`,
};

export default function NotFound() {
  return (
    <PageContainer>
      <section className={styles.container}>
        <Image src={notFound} alt="404, page not found" />
        <h1>Not Found</h1>
      </section>
    </PageContainer>
  );
}
