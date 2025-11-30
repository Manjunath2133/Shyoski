import { sign } from '@tsndr/cloudflare-worker-jwt';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_AUTH_SCOPE = 'https://www.googleapis.com/auth/datastore';

let accessToken = null;
let tokenExpiry = 0;

/**
 * Generates a Google Cloud access token using a service account.
 * It caches the token until it's close to expiring.
 * @param {object} env - The Cloudflare Worker environment object.
 * @returns {Promise<string>} The access token.
 */
export async function getGcpAccessToken(env) {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const serviceAccountJson = env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    console.error('CRITICAL: GOOGLE_SERVICE_ACCOUNT_JSON secret is not set in Cloudflare Worker environment.');
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON secret is not set.');
  }

  const creds = JSON.parse(serviceAccountJson);
  console.log(`Attempting to generate GCP token for service account: ${creds.client_email}`);
  if (!creds.client_email || !creds.private_key) {
    console.error('CRITICAL: GOOGLE_SERVICE_ACCOUNT_JSON is malformed. It must contain client_email and private_key.');
  }
  const jwtPayload = {
    iss: creds.client_email,
    sub: creds.client_email,
    aud: GOOGLE_TOKEN_URL,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    scope: GOOGLE_AUTH_SCOPE,
  };

  const jwt = await sign(jwtPayload, creds.private_key, { algorithm: 'RS256' });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  const tokenData = await response.json();
  if (!response.ok || !tokenData.access_token) {
    console.error('CRITICAL: Failed to obtain Google Cloud access token. Response from Google:', JSON.stringify(tokenData, null, 2));
    throw new Error('Failed to obtain Google Cloud access token.');
  }

  accessToken = tokenData.access_token;
  console.log('Successfully obtained new GCP access token.');

  // Cache token, refreshing 5 minutes before it expires
  tokenExpiry = Date.now() + (tokenData.expires_in - 300) * 1000;

  return accessToken;
}