'use client';
import { PageContainer } from '@/components/utils/page-container';
import Image from 'next/image';
import oops from '../../public/static/images/pages/error/oops.png';
import styles from './error.module.scss';

export default function Error() {
  return (
    <PageContainer>
      <section className={styles.container}>
        <Image src={oops} alt="Woman holding sign that says 'Oops'" />
        <h1 className={styles.heading}>
          Something
          <br />
          Went Wrong
        </h1>
      </section>
    </PageContainer>
  );
}
