import { CloudflareTurnstileTokenValidator } from '@/services/cloudflare-turnstile-token-validator';
import { CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS } from '@/constants/cloudflare-turnstile-dummy-secret-keys';

describe('CloudflareTurnstileTokenValidator', () => {
  let validateCloudflareTurnstile: CloudflareTurnstileTokenValidator;
  const { TURNSTILE_SECRET_KEY } = process.env;

  beforeEach(() => {
    validateCloudflareTurnstile = new CloudflareTurnstileTokenValidator();
  });

  afterEach(() => {
    process.env.TURNSTILE_SECRET_KEY = TURNSTILE_SECRET_KEY;
  });

  it('returns true with a secret key that always passes', async () => {
    const result = await validateCloudflareTurnstile.isHuman({
      captchaToken: 'test-token',
    });

    expect(result).toBe(true);
  });

  it('returns true with a secret key that always fails', async () => {
    process.env.TURNSTILE_SECRET_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS.ALWAYS_BLOCKS;
    const result = await validateCloudflareTurnstile.isHuman({
      captchaToken: 'test-token',
    });

    expect(result).toBe(false);
  });

  it('returns false with a secret key that is already spent', async () => {
    process.env.TURNSTILE_SECRET_KEY =
      CLOUDFLARE_TURNSTILE_DUMMY_SECRET_KEYS.ALREADY_SPENT;
    const result = await validateCloudflareTurnstile.isHuman({
      captchaToken: 'test-token',
    });

    expect(result).toBe(false);
  });

  it('returns false without a token', async () => {
    process.env.TURNSTILE_SECRET_KEY = undefined;
    const result = await validateCloudflareTurnstile.isHuman({
      captchaToken: '',
    });

    expect(result).toBe(false);
  });
});
