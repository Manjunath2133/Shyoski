import { toFirestoreUpdate, fromFirestore } from '../utils/firebase.js';
import Company from '../models/company.js';
import { getGcpAccessToken } from '../utils/gcp-auth.js';

function companyToFirestore(company) {
    return {
        fields: {
            name: { stringValue: company.name },
            owner: { stringValue: company.owner },
            members: { arrayValue: { values: company.members.map(m => ({ stringValue: m })) } },
            projects: { arrayValue: { values: [] } },
            createdAt: { timestampValue: company.createdAt.toISOString() }
        }
    };
}

// Create a new company
export const createCompany = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
        return c.json({ message: 'Firebase project ID is not configured.' }, 500);
    }

    try {
        const { name } = await c.req.json();
        const owner = c.get('user').uid;
        const newCompany = new Company(name, owner);
        const firestoreCompany = companyToFirestore(newCompany);

        const accessToken = await getGcpAccessToken(c.env);
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/companies`;

        const response = await fetch(firestoreUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(firestoreCompany)
        });

        if (response.ok) {
            const createdCompany = await response.json();
            return c.json(fromFirestore(createdCompany), 201);
        } else {
            const error = await response.json();
            console.error('Error creating company:', error);
            return c.json({ message: 'Server error' }, 500);
        }
    } catch (error) {
        console.error('Error creating company:', error);
        return c.json({ message: 'Server error' }, 500);
    }
};

// Get all companies for a user
export const getCompanies = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    try {
        const userId = c.get('user').uid;
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
        const accessToken = await getGcpAccessToken(c.env);

        const response = await fetch(firestoreUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'companies' }],
                    where: {
                        fieldFilter: {
                            field: { fieldPath: 'members' },
                            op: 'ARRAY_CONTAINS',
                            value: { stringValue: userId }
                        }
                    }
                }
            })
        });

        if (response.ok) {
            const docs = await response.json();
            const companies = docs.map(doc => fromFirestore(doc.document));
            return c.json(companies);
        } else {
            const error = await response.json();
            console.error('Error getting companies:', error);
            return c.json({ message: 'Server error' }, 500);
        }
    } catch (error) {
        console.error('Error getting companies:', error);
        return c.json({ message: 'Server error' }, 500);
    }
};

// Get a company by ID
export const getCompanyById = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    try {
        const companyId = c.req.param('id');
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/companies/${companyId}`;

        const accessToken = await getGcpAccessToken(c.env);
        const response = await fetch(firestoreUrl, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (response.ok) {
            const companyDoc = await response.json();
            return c.json(fromFirestore(companyDoc));
        } else if (response.status === 404) {
            return c.json({ message: 'Company not found' }, 404);
        } else {
            const error = await response.json();
            console.error('Error getting company:', error);
            return c.json({ message: 'Server error' }, 500);
        }
    } catch (error) {
        console.error('Error getting company by ID:', error);
        return c.json({ message: 'Server error' }, 500);
    }
};

// Update a company
export const updateCompany = async (c) => {
    return c.json({ message: 'Not Implemented' }, 501);
};

// Delete a company
export const deleteCompany = async (c) => {
    return c.json({ message: 'Not Implemented' }, 501);
};

// Invite a user to a company
export const inviteUser = async (c) => {
    return c.json({ message: 'Not Implemented: This function requires the Firebase Admin Auth API.' }, 501);
};