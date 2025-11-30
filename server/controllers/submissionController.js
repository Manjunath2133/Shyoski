import { fromFirestore } from '../utils/firebase.js';
import Submission from '../models/submission.js';

function submissionToFirestore(submission) {
    return {
        fields: {
            studentId: { stringValue: submission.studentId },
            week: { integerValue: submission.week },
            repoUrl: { stringValue: submission.repoUrl },
            status: { stringValue: submission.status },
            submittedAt: { timestampValue: submission.submittedAt.toISOString() },
            feedback: { stringValue: submission.feedback }
        }
    };
}

export const submitProject = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    const { week, repoUrl } = await c.req.json();
    const studentId = c.get('user').id; // from checkRole middleware
    console.log('Submitting project for student:', studentId);

    try {
        const newSubmission = new Submission(studentId, week, repoUrl);
        console.log('New submission object:', newSubmission);
        const firestoreSubmission = submissionToFirestore(newSubmission);
        
        const docId = `${studentId}_week${week}`;
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/submissions/${docId}`;
        
        const idToken = c.req.header('Authorization').split('Bearer ')[1];

        const response = await fetch(firestoreUrl, {
            method: 'PATCH', // Using PATCH with the doc ID in the URL will create or overwrite.
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(firestoreSubmission)
        });

        if (response.ok) {
            console.log('Submission successfully saved.');
            return c.json({ message: 'Submission successful' }, 201);
        } else {
            const error = await response.json();
            console.error('Error submitting project:', error);
            return c.json({ message: 'Error submitting project' }, 500);
        }
    } catch (error) {
        console.error('Error submitting project:', error);
        return c.json({ message: 'Error submitting project' }, 500);
    }
};

export const getStudentSubmissions = async (c) => {
    const projectId = c.env.FIREBASE_PROJECT_ID;
    if (!projectId) { return c.json({ message: 'Firebase project ID is not configured.' }, 500); }

    const studentId = c.get('user').id;

    try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;
        const idToken = c.req.header('Authorization').split('Bearer ')[1];

        const response = await fetch(firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
            body: JSON.stringify({
                structuredQuery: {
                    from: [{ collectionId: 'submissions' }],
                    where: {
                        fieldFilter: {
                            field: { fieldPath: 'studentId' },
                            op: 'EQUAL',
                            value: { stringValue: studentId }
                        }
                    }
                }
            })
        });

        if (response.ok) {
            const docs = await response.json();
            if (!docs || docs.length === 0) {
                return c.json([]);
            }
            const submissions = docs.map(doc => fromFirestore(doc.document));
            return c.json(submissions);
        } else {
             const error = await response.json();
            console.error('Error getting submissions:', error);
            return c.json({ message: 'Error getting submissions' }, 500);
        }
    } catch (error) {
        console.error('Error getting submissions:', error);
        return c.json({ message: 'Error getting submissions' }, 500);
    }
};