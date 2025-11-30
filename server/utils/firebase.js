import * as jose from 'jose';

const FIREBASE_PUBLIC_KEYS_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

let publicKeys;

async function getPublicKeys() {
    if (!publicKeys) {
        const response = await fetch(FIREBASE_PUBLIC_KEYS_URL);
        publicKeys = await response.json();
    }
    return publicKeys;
}

export async function verifyIdToken(idToken, projectId) {
    const keys = await getPublicKeys();
    const { payload } = await jose.jwtVerify(idToken, (header, alg) => {
        return keys[header.kid];
    }, {
        issuer: `https://securetoken.google.com/${projectId}`,
        audience: projectId,
        algorithms: ['RS256'],
    });
    return payload;
}


// Helper to convert a User object to Firestore REST API format for creation
export function userToFirestore(user) {
    return {
        fields: {
            id: { stringValue: user.id },
            email: { stringValue: user.email },
            role: { stringValue: user.role },
            name: { stringValue: user.name },
            photoUrl: { stringValue: user.photoUrl },
            hasPaid: { booleanValue: user.hasPaid },
            certificateId: { nullValue: null },
            bio: { stringValue: user.bio },
            skills: { arrayValue: { values: [] } },
            socialLinks: {
                mapValue: {
                    fields: {
                        linkedin: { stringValue: '' },
                        twitter: { stringValue: '' },
                        github: { stringValue: '' },
                    }
                }
            },
            portfolio: { arrayValue: { values: [] } },
            billing: {
                mapValue: {
                    fields: {
                        plan: { stringValue: 'free' },
                        nextBillingDate: { nullValue: null },
                        paymentHistory: { arrayValue: { values: [] } },
                    }
                }
            }
        }
    };
}


// Helper to convert a plain object to Firestore fields for updates
export function toFirestoreUpdate(obj) {
    const fields = {};
    const updateMask = [];
    for (const key in obj) {
        const value = obj[key];
        updateMask.push(key);
        if (typeof value === 'string') {
            fields[key] = { stringValue: value };
        } else if (typeof value === 'boolean') {
            fields[key] = { booleanValue: value };
        } else if (typeof value === 'number') {
            // All numbers are treated as double in firestore REST API unless specified
            fields[key] = { doubleValue: value };
        } else if (value === null) {
            fields[key] = { nullValue: null };
        } else if (Array.isArray(value)) {
            // For simplicity, assuming array of strings
            fields[key] = { arrayValue: { values: value.map(v => ({ stringValue: v })) } };
        } else if (typeof value === 'object') {
             // This is a simplified version. A complete solution would recursively convert nested objects.
            fields[key] = { mapValue: { fields: toFirestoreUpdate(value).fields } };
        }
    }
    return { fields, updateMask: updateMask.join('&') };
}

// Helper to convert from Firestore REST API format to a regular object
export function fromFirestore(firestoreDoc) {
    if (!firestoreDoc || !firestoreDoc.fields) {
        // Handle cases where the document or its fields are missing
        return {};
    }
    const fields = firestoreDoc.fields;
    const result = {};
    for (const key in fields) {
        const valueWrapper = fields[key];
        const valueType = Object.keys(valueWrapper)[0];
        let value = valueWrapper[valueType];

        if (valueType === 'mapValue') {
            value = fromFirestore(value);
        } else if (valueType === 'arrayValue') {
            value = (value.values || []).map(v => {
                if(!v) return null;
                const innerValueType = Object.keys(v)[0];
                return v[innerValueType];
            });
        }
        result[key] = value;
    }
    return result;
}
