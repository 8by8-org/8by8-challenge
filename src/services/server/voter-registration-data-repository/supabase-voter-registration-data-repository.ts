import 'server-only';
import { VoterRegistrationDataRepository } from './voter-registration-data-repository';
import { ServerError } from '@/errors/server-error';
import { SERVER_SERVICE_KEYS } from '../keys';
import { inject } from 'undecorated-di';
import { Encryptor } from '../encryptor/encryptor';
import { PRIVATE_ENVIRONMENT_VARIABLES } from '@/constants/private-environment-variables';
import type { CreateSupabaseClient } from '../create-supabase-client/create-supabase-client';

export const SupabaseVoterRegistrationDataRepository = inject(
  /**
   * handles voter registration proccess
   * @example
   */
  class SupabaseVoterRegistrationDataRepository implements VoterRegistrationDataRepository {
    constructor(
      private createSupabaseClient: CreateSupabaseClient,
      private encryptor: Encryptor,
    ) {}

    async getPDFUrlByUserId(userId: string): Promise<string> {
      const supabase = this.createSupabaseClient();

      const { data, error, status } = await supabase
        .from('registration_information')
        .select('pdf_url')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        throw new ServerError(error.message, status);
      }

      if (!data?.pdf_url) return '';

      try {
        const decryptionKey =
          await PRIVATE_ENVIRONMENT_VARIABLES.VOTER_REGISTRATION_REPO_ENCRYPTION_KEY;
        const decrypted = await this.encryptor.decrypt(
          data.pdf_url,
          decryptionKey,
        );
        return decrypted;
      } catch (e) {
        throw new ServerError('Could not decrypt PDF URL.', 400);
      }
    }

    async savePDFUrl(userId: string, pdfUrl: string): Promise<void> {
      const encryptionKey =
        await PRIVATE_ENVIRONMENT_VARIABLES.VOTER_REGISTRATION_REPO_ENCRYPTION_KEY;

      const encryptedPDFUrl = await this.encryptor.encrypt(
        pdfUrl,
        encryptionKey,
      );

      const supabase = this.createSupabaseClient();

      const { error, status } = await supabase
        .from('registration_information')
        .insert({
          user_id: userId,
          pdf_url: encryptedPDFUrl,
        });

      if (error) {
        throw new ServerError(error.message, status);
      }
    }
  },
  [
    SERVER_SERVICE_KEYS.createSupabaseServiceRoleClient,
    SERVER_SERVICE_KEYS.Encryptor,
  ],
);
