const admin = require('firebase-admin');
const Submission = require('../models/submission');

const db = admin.firestore();

exports.submitProject = async (req, res) => {
    const { week, repoUrl } = req.body;
    const studentId = req.user.id; // from checkRole middleware
    console.log('Submitting project for student:', studentId);

    try {
        const newSubmission = new Submission(studentId, week, repoUrl);
        console.log('New submission object:', newSubmission);
        const submissionRef = db.collection('submissions').doc(`${studentId}_week${week}`);
        
        await submissionRef.set(Object.assign({}, newSubmission));
        console.log('Submission successfully saved.');
        
        res.status(201).json({ message: 'Submission successful' });
    } catch (error) {
        console.error('Error submitting project:', error);
        res.status(500).json({ message: 'Error submitting project' });
    }
};

exports.getStudentSubmissions = async (req, res) => {
    const studentId = req.user.id;

    try {
        const submissionsRef = db.collection('submissions').where('studentId', '==', studentId);
        const snapshot = await submissionsRef.get();
        
        if (snapshot.empty) {
            return res.status(200).json([]);
        }

        const submissions = [];
        snapshot.forEach(doc => {
            submissions.push(doc.data());
        });

        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error getting submissions:', error);
        res.status(500).json({ message: 'Error getting submissions' });
    }
};
