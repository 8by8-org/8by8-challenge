const KeywordValues = {
  None: "'none'",
  Self: "'self'",
  UnsafeInline: "'unsafe-inline'",
  UnsafeEval: "'unsafe-eval'",
};

const ExternalSources = {
  RockTheVote: 'https://register.rockthevote.com/',
  RockyAPIAssets: 'https://s3.amazonaws.com/rocky-assets/',
  Cloudflare: 'https://challenges.cloudflare.com/',
  VercelTools: 'https://vercel.live/',
  GoogleTagManager: 'https://www.googletagmanager.com/',
  GoogleAnalytics: 'https://www.google-analytics.com/',
};

/**
 * Creates the Content Security Policy header depending on the environment.
 *
 * For more information about the CSP header, please see
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP}.
 */
export function createCSP() {
  const directives = [
    {
      directive: 'default-src',
      values: [KeywordValues.Self],
    },
    {
      directive: 'script-src',
      values: getAllowedScriptSources(),
    },
    {
      /*
        Allow Rock the Vote's Pledge to Vote form and the Cloudflare Turnstile 
        widget to be rendered in IFrames.
      */
      directive: 'frame-src',
      values: [
        ExternalSources.RockTheVote,
        ExternalSources.Cloudflare,
        ExternalSources.VercelTools,
      ],
    },
    {
      directive: 'connect-src',
      values: [
        KeywordValues.Self,
        getSupabaseRealtimeSocketURL(),
        ExternalSources.GoogleAnalytics,
      ],
    },
    {
      directive: 'style-src',
      values: [KeywordValues.Self, KeywordValues.UnsafeInline],
    },
    {
      directive: 'img-src',
      values: [KeywordValues.Self, 'blob:', 'data:'],
    },
    {
      directive: 'font-src',
      values: [KeywordValues.Self],
    },
    {
      directive: 'object-src',
      values: [KeywordValues.None],
    },
    {
      directive: 'base-uri',
      values: [KeywordValues.Self],
    },
    {
      directive: 'form-action',
      values: [KeywordValues.Self],
    },
    {
      directive: 'frame-ancestors',
      values: [KeywordValues.None],
    },
    {
      directive: 'block-all-mixed-content',
    },
    {
      directive: 'upgrade-insecure-requests',
    },
  ];

  return {
    key: 'Content-Security-Policy',
    value: joinDirectives(directives),
  };
}

/**
 * Returns an array of allowed script sources, which differs depending on
 * whether the app is running via the dev server or the production server.
 */
function getAllowedScriptSources() {
  const allowedScriptSources = [
    KeywordValues.Self,
    KeywordValues.UnsafeInline,
    ExternalSources.RockTheVote,
    ExternalSources.RockyAPIAssets,
    ExternalSources.Cloudflare,
    ExternalSources.VercelTools,
    ExternalSources.GoogleTagManager,
  ];

  // 'unsafe-eval' is required by Next.js when running the dev server
  if (process.env.NODE_ENV !== 'production') {
    allowedScriptSources.push(KeywordValues.UnsafeEval);
  }

  return allowedScriptSources;
}

/**
 * Gets the websocket URL for Supabase Realtime. If `process.env.APP_ENV` is
 * 'production', expects process.env.SUPABASE_PROJECT_ID to be defined.
 *
 * For information on the format of this URL, please see
 * {@link https://github.com/supabase/realtime?tab=readme-ov-file#websocket-url}.
 */
function getSupabaseRealtimeSocketURL() {
  if (process.env.APP_ENV === 'production') {
    if (!process.env.SUPABASE_PROJECT_ID) {
      throw new Error(
        'Could not read environment variable SUPABASE_PROJECT_ID. Are you sure it has been declared?',
      );
    }

    return `wss://${process.env.SUPABASE_PROJECT_ID}.supabase.co/realtime/`;
  } else {
    return 'ws://127.0.0.1:54321/realtime/';
  }
}

/**
 * Takes in an array of directive objects and joins them into a single string
 * separated by semi-colons.
 */
function joinDirectives(directives) {
  return directives
    .map(({ directive, values }) => {
      return `${values && values.length ? [directive, ...values].join(' ') : directive};`;
    })
    .join('');
}
