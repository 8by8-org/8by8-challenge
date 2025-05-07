import { serverContainer } from '@/services/server/container';
import { SERVER_SERVICE_KEYS } from '@/services/server/keys';
import { RegistrationCompleted } from './completed';
import { HOME_PAGE_TITLE } from '@/constants/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `${HOME_PAGE_TITLE} | Register to Vote`,
};

export default async function Page() {
  const auth = serverContainer.get(SERVER_SERVICE_KEYS.Auth);
  const voterRegistrationDataRepo = serverContainer.get(
    SERVER_SERVICE_KEYS.VoterRegistrationDataRepository,
  );
  const user = await auth.loadSessionUser();
  let pdfUrl = '';

  if (user) {
    try {
      pdfUrl = await voterRegistrationDataRepo.getPDFUrlByUserId(user.uid);
    } catch (e) {
      console.error(e);
    }
  }

  return <RegistrationCompleted pdfUrl={pdfUrl} />;
}
