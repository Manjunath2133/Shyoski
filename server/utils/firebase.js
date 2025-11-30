// import * as jose from 'jose';

// const FIREBASE_PUBLIC_KEYS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

// let publicKeys;

// async function getPublicKeys() {
//     if (!publicKeys) {
//         const response = await fetch(FIREBASE_PUBLIC_KEYS_URL);
//         publicKeys = await response.json();
//     }
//     return publicKeys;
// }

// export async function verifyIdToken(idToken, projectId) {
//     const keys = await getPublicKeys();
//     const { payload } = await jose.jwtVerify(idToken, (header, alg) => {
//         return jose.importX509(keys[header.kid]);
//     }, {
//         issuer: `https://securetoken.google.com/${projectId}`,
//         audience: projectId,
//         algorithms: ['RS256'],
//     });
//     return payload;
// }


// // Helper to convert a User object to Firestore REST API format for creation
// export function userToFirestore(user) {
//     return {
//         fields: {
//             id: { stringValue: user.id },
//             email: { stringValue: user.email },
//             role: { stringValue: user.role },
//             name: { stringValue: user.name },
//             photoUrl: { stringValue: user.photoUrl },
//             hasPaid: { booleanValue: user.hasPaid },
//             certificateId: { nullValue: null },
//             bio: { stringValue: user.bio },
//             skills: { arrayValue: { values: [] } },
//             socialLinks: {
//                 mapValue: {
//                     fields: {
//                         linkedin: { stringValue: '' },
//                         twitter: { stringValue: '' },
//                         github: { stringValue: '' },
//                     }
//                 }
//             },
//             portfolio: { arrayValue: { values: [] } },
//             billing: {
//                 mapValue: {
//                     fields: {
//                         plan: { stringValue: 'free' },
//                         nextBillingDate: { nullValue: null },
//                         paymentHistory: { arrayValue: { values: [] } },
//                     }
//                 }
//             }
//         }
//     };
// }


// // Helper to convert a plain object to Firestore fields for updates
// export function toFirestoreUpdate(obj) {
//     const fields = {};
//     const updateMask = [];
//     for (const key in obj) {
//         const value = obj[key];
//         updateMask.push(key);
//         if (typeof value === 'string') {
//             fields[key] = { stringValue: value };
//         } else if (typeof value === 'boolean') {
//             fields[key] = { booleanValue: value };
//         } else if (typeof value === 'number') {
//             // All numbers are treated as double in firestore REST API unless specified
//             fields[key] = { doubleValue: value };
//         } else if (value === null) {
//             fields[key] = { nullValue: null };
//         } else if (Array.isArray(value)) {
//             // For simplicity, assuming array of strings
//             fields[key] = { arrayValue: { values: value.map(v => ({ stringValue: v })) } };
//         } else if (typeof value === 'object') {
//              // This is a simplified version. A complete solution would recursively convert nested objects.
//             fields[key] = { mapValue: { fields: toFirestoreUpdate(value).fields } };
//         }
//     }
//     return { fields, updateMask: updateMask.join('&') };
// }

// // Helper to convert from Firestore REST API format to a regular object
// export function fromFirestore(firestoreDoc) {
//     if (!firestoreDoc || !firestoreDoc.fields) {
//         // Handle cases where the document or its fields are missing
//         return {};
//     }
//     const fields = firestoreDoc.fields;
//     const result = {};
//     for (const key in fields) {
//         const valueWrapper = fields[key];
//         const valueType = Object.keys(valueWrapper)[0];
//         let value = valueWrapper[valueType];

//         if (valueType === 'mapValue') {
//             value = fromFirestore(value);
//         } else if (valueType === 'arrayValue') {
//             value = (value.values || []).map(v => {
//                 if(!v) return null;
//                 const innerValueType = Object.keys(v)[0];
//                 return v[innerValueType];
//             });
//         }
//         result[key] = value;
//     }
//     return result;
// }



// utils/firebase.js
import { createRemoteJWKSet, jwtVerify } from 'jose';

// JWKS URL for Firebase ID tokens (securetoken)
const SECURETOKEN_JWKS =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

// Optional default project id (safe to hardcode; not secret)
const DEFAULT_PROJECT_ID = 'shyoski-88e92';

// Create a Remote JWK Set (handles caching + key selection by kid)
const JWKS = createRemoteJWKSet(new URL(SECURETOKEN_JWKS));

/**
 * Verify a Firebase ID token and return the decoded payload.
 * @param {string} idToken
 * @param {string} [projectId] optional - will use DEFAULT_PROJECT_ID if omitted
 * @returns {Promise<object>} payload
 */
export async function verifyIdToken(idToken, projectId = DEFAULT_PROJECT_ID) {
  if (!idToken || typeof idToken !== 'string') {
    const e = new Error('idToken missing or invalid');
    e.name = 'InvalidArgument';
    throw e;
  }
  if (!projectId) {
    const e = new Error('projectId missing');
    e.name = 'InvalidArgument';
    throw e;
  }

  // jwtVerify throws clear jose errors (JWTExpired, JWSInvalid, JOSENotSupported, etc.)
  const verified = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    algorithms: ['RS256'],
  });

  return verified.payload;
}

/* ---------------------------
   Firestore helpers
   (kept your shapes but fixed a couple bugs)
   --------------------------- */

/**
 * Convert a User object to Firestore REST API document format
 * (fields wrapped as Firestore value objects).
 */
export function userToFirestore(user) {
  return {
    fields: {
      id: { stringValue: user.id },
      email: { stringValue: user.email || '' },
      role: { stringValue: user.role || '' },
      name: { stringValue: user.name || '' },
      photoUrl: { stringValue: user.photoUrl || '' },
      hasPaid: { booleanValue: !!user.hasPaid },
      certificateId: user.certificateId == null ? { nullValue: null } : { stringValue: user.certificateId },
      bio: { stringValue: user.bio || '' },
      skills: { arrayValue: { values: (user.skills || []).map(s => ({ stringValue: s })) } },
      socialLinks: {
        mapValue: {
          fields: {
            linkedin: { stringValue: (user.socialLinks && user.socialLinks.linkedin) || '' },
            twitter: { stringValue: (user.socialLinks && user.socialLinks.twitter) || '' },
            github: { stringValue: (user.socialLinks && user.socialLinks.github) || '' },
          }
        }
      },
      portfolio: { arrayValue: { values: (user.portfolio || []).map(p => ({ stringValue: p })) } },
      billing: {
        mapValue: {
          fields: {
            plan: { stringValue: (user.billing?.plan) || 'free' },
            nextBillingDate: user.billing?.nextBillingDate == null ? { nullValue: null } : { stringValue: user.billing.nextBillingDate },
            paymentHistory: { arrayValue: { values: (user.billing?.paymentHistory || []).map(item => ({ stringValue: item })) } },
          }
        }
      }
    }
  };
}

/**
 * Convert a plain object to Firestore REST update fields.
 * Returns { fields, updateMask } where updateMask is a comma-separated list of top-level keys.
 */
export function toFirestoreUpdate(obj) {
  const fields = {};
  const updateMask = [];

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    updateMask.push(key);

    if (typeof value === 'string') fields[key] = { stringValue: value };
    else if (typeof value === 'boolean') fields[key] = { booleanValue: value };
    else if (typeof value === 'number') fields[key] = { doubleValue: value };
    else if (value === null) fields[key] = { nullValue: null };
    else if (Array.isArray(value)) {
      fields[key] = { arrayValue: { values: value.map(v => {
        if (v === null) return { nullValue: null };
        if (typeof v === 'string') return { stringValue: v };
        if (typeof v === 'number') return { doubleValue: v };
        if (typeof v === 'boolean') return { booleanValue: v };
        // fallback to string
        return { stringValue: String(v) };
      }) } };
    } else if (typeof value === 'object') {
      // recursively convert nested object
      const nested = toFirestoreUpdate(value);
      fields[key] = { mapValue: { fields: nested.fields } };
    } else {
      // fallback: stringify
      fields[key] = { stringValue: String(value) };
    }
  }

  return { fields, updateMask: updateMask.join(',') };
}

/**
 * Convert Firestore REST document structure to plain JS object.
 * Handles mapValue and arrayValue properly.
 */
export function fromFirestore(firestoreDoc) {
  if (!firestoreDoc || !firestoreDoc.fields) return {};

  function unwrapValue(valueWrapper) {
    if (!valueWrapper) return null;
    const type = Object.keys(valueWrapper)[0];
    const value = valueWrapper[type];

    if (type === 'stringValue') return value;
    if (type === 'booleanValue') return value;
    if (type === 'doubleValue' || type === 'integerValue') return Number(value);
    if (type === 'nullValue') return null;
    if (type === 'mapValue') {
      // value is { fields: { ... } }
      return fromFirestore({ fields: value.fields });
    }
    if (type === 'arrayValue') {
      return (value.values || []).map(v => unwrapValue(v));
    }
    // unknown wrapper, return raw
    return value;
  }

  const out = {};
  for (const k of Object.keys(firestoreDoc.fields)) {
    out[k] = unwrapValue(firestoreDoc.fields[k]);
  }
  return out;
}
