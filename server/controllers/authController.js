// import { verifyIdToken, userToFirestore, fromFirestore } from '../utils/firebase.js';
// import User from '../models/user.js';


// export const verifyTokenAndCreateUser = async (c) => {
//     const { idToken } = await c.req.json();
//     const projectId = c.env.FIREBASE_PROJECT_ID;
//     console.log('Firebase Project ID:', projectId);




//     if (!projectId) {
//         return c.json({ message: 'Firebase project ID is not configured.' }, 500);
//     }

//     try {
//         const decodedToken = await verifyIdToken(idToken, projectId);
//         const { uid, email, name, picture } = decodedToken;

//         const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`;

//         // Check if user exists
//         const response = await fetch(firestoreUrl, {
//             headers: {
//                 'Authorization': `Bearer ${idToken}`
//             }
//         });

//         if (response.ok) {
//             // User exists
//             const userDoc = await response.json();
//             return c.json(fromFirestore(userDoc));
//         } else if (response.status === 404) {
//             // User does not exist, create new user
//             const newUser = new User(uid, email, 'student', name, picture);
//             const firestoreUser = userToFirestore(newUser);

//             const createResponse = await fetch(firestoreUrl, {
//                 method: 'PATCH', // Using PATCH with no path creates a document
//                 headers: {
//                     'Authorization': `Bearer ${idToken}`,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(firestoreUser)
//             });

//             if (createResponse.ok) {
//                 return c.json(newUser, 201);
//             } else {
//                 const error = await createResponse.json();
//                 console.error('Error creating user in Firestore:', error);
//                 return c.json({ message: 'Failed to create user.' }, 500);
//             }
//         } else {
//             // Another error occurred
//              const error = await response.json();
//              console.error('Error fetching user:', error);
//              return c.json({ message: 'Error fetching user data.' }, response.status);
//         }
//     } catch (error) {
//         console.error('Error verifying token or creating user:', error.message || error);
//         return c.json({ message: 'Unauthorized' }, 401);
//     }
// };


// controllers/authController.js
import { verifyIdToken, userToFirestore, fromFirestore } from '../utils/firebase.js';
import User from '../models/user.js';
import { getGcpAccessToken } from '../utils/gcp-auth.js';

export const verifyTokenAndCreateUser = async (c) => {
  try {
    const { idToken } = await c.req.json().catch(() => ({}));
    const projectId = c.env.FIREBASE_PROJECT_ID;
    console.log('Firebase Project ID:', projectId);

    if (!projectId) {
      return c.json({ message: 'Firebase project ID is not configured.' }, 500);
    }
    if (!idToken || typeof idToken !== 'string') {
      return c.json({ message: 'idToken missing or invalid' }, 400);
    }

    // Verify ID token and get decoded payload
    let decodedToken;
    try {
      decodedToken = await verifyIdToken(idToken, projectId);
    } catch (err) {
      console.error('Token verification failed:', err?.name || err?.message || err);
      // Map jose / verification errors to friendly responses
      if (err?.name === 'JWTExpired') return c.json({ message: 'token-expired' }, 401);
      if (err?.name === 'JOSENotSupported') return c.json({ message: 'token-alg-not-supported' }, 500);
      return c.json({ message: 'invalid-token' }, 401);
    }

    const { uid, email, name, picture } = decodedToken;
    if (!uid) return c.json({ message: 'token missing uid' }, 401);

    // Firestore REST document path
    const docPath = `projects/${projectId}/databases/(default)/documents/users/${uid}`;
    const firestoreDocUrl = `https://firestore.googleapis.com/v1/${docPath}`;

    const accessToken = await getGcpAccessToken(c.env);

    // Try GET to see if user exists
    const getResp = await fetch(firestoreDocUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (getResp.ok) {
      const userDoc = await getResp.json();
      const user = fromFirestore(userDoc);
      return c.json(user, 200);
    }

    if (getResp.status !== 404) {
      // unexpected error when fetching
      const errBody = await safeJson(getResp);
      console.error('Error fetching user doc:', getResp.status, errBody);
      return c.json({ message: 'Error fetching user data.' }, getResp.status);
    }

    // user not found -> create using POST to collection with documentId=uid
    const newUser = new User(uid, email, 'student', name, picture);
    const firestoreUser = userToFirestore(newUser);

    // Use collection create endpoint with documentId param to explicitly create document with uid
    const createUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/users?documentId=${encodeURIComponent(uid)}`;

    const createResp = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(firestoreUser)
    });

    if (createResp.ok) {
      // created
      return c.json(newUser, 201);
    } else {
      const errBody = await safeJson(createResp);
      console.error('Error creating user in Firestore:', createResp.status, errBody);
      // If unauthorized (403/401) - probably Firestore rules or token scope
      if (createResp.status === 401 || createResp.status === 403) {
        return c.json({ message: 'Failed to create user: unauthorized (check Firestore rules and that idToken has proper scope).' }, createResp.status);
      }
      return c.json({ message: 'Failed to create user.' }, 500);
    }

  } catch (error) {
    console.error('Error in verifyTokenAndCreateUser:', error);
    return c.json({ message: 'Internal server error' }, 500);
  }
};

// helper to safely parse JSON body (returns object or raw text)
async function safeJson(resp) {
  try {
    return await resp.json();
  } catch (e) {
    try {
      return await resp.text();
    } catch (e2) {
      return null;
    }
  }
}
//hello