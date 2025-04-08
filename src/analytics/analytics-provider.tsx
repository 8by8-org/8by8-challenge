import { readPublicEnvironmentVariables } from '@/utils/environment/read-public-environment-variables';
import { GoogleAnalytics } from '@next/third-parties/google';

export function AnalyticsProvider() {
  const gaId = readPublicEnvironmentVariables().NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  if (!gaId) {
    console.warn(
      'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID not detected in environment variables. Analytics will not be mounted.',
    );
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
