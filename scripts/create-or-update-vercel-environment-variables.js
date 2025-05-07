createOrUpdateEnvironmentVariables();

/**
 * Creates or updates environment variables in Vercel.
 *
 * @remarks
 * Values are read from the current environment. The project ID and Vercel access
 * token are also read from the current environment. This script is intended to
 * be executed in a Github actions workflow in which these environment variables
 * have been initialized with values read from Github secrets and environment
 * variables.
 *
 * Environment variables that are not prefixed with "NEXT_PUBLIC_" are marked
 * sensitive in Vercel, meaning that they cannot be viewed in the Vercel
 * dashboard.
 *
 * This script is required because, although the project is built in GH actions
 * and then deployed to Vercel, the application must access environment
 * variables at runtime. Therefore, the same environment variables accessed
 * at build time must be made available to the deployed app.
 */
async function createOrUpdateEnvironmentVariables() {
  const environment = process.argv[2];

  if (!['preview', 'production'].includes(environment)) {
    throw new Error(
      'Please specify a valid environment. Valid choices are "preview" or "production."',
    );
  }

  console.log(
    'Copying environment variables to Vercel. Secrets will be copied into sensitive environment variables.',
  );

  const environmentVariableKeys = [
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
    'TURNSTILE_SECRET_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GOOGLE_MAPS_API_KEY',
    'VOTER_REGISTRATION_REPO_ENCRYPTION_KEY',
    'CRYPTO_KEY_COOKIES',
    'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID',
  ];

  for (const key of environmentVariableKeys) {
    const value = process.env[key];
    const isSensitive = !key.startsWith('NEXT_PUBLIC_');
    await createOrUpdateEnvironmentVariable(
      key,
      value,
      environment,
      isSensitive,
    );
  }

  console.log('Copied secrets to vercel.');
}

async function createOrUpdateEnvironmentVariable(
  key,
  value,
  environment,
  sensitive,
) {
  const response = await fetch(
    `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/env?upsert=true`,
    {
      body: JSON.stringify({
        key,
        value,
        type: sensitive ? 'sensitive' : 'plain',
        target: [environment],
      }),
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
      method: 'POST',
    },
  );

  if (!response.ok) {
    throw new Error(
      'Failed to create or update environment variable. Status was ' +
        response.status,
    );
  }
}
