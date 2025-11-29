const admin = require('firebase-admin');
const db = admin.firestore();

exports.updateSubmissionStatus = async (req, res) => {
    const evaluatorId = req.user.uid;
    const { studentId, week, status } = req.body;

    try {
        const submissionRef = db.collection('submissions').doc(`${studentId}_week${week}`);
        await submissionRef.update({ status, evaluatorId });
        res.status(200).json({ message: `Submission for week ${week} updated to ${status}` });
    } catch (error) {
        console.error('Error updating submission status:', error);
        res.status(500).json({ message: 'Error updating submission status' });
    }
};

exports.addFeedback = async (req, res) => {
    const { studentId, week, feedback } = req.body;

    try {
        const submissionRef = db.collection('submissions').doc(`${studentId}_week${week}`);
        await submissionRef.update({ feedback });
        res.status(200).json({ message: `Feedback for week ${week} added` });
    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({ message: 'Error adding feedback' });
    }
};

exports.getStudentSubmissions = async (req, res) => {
    const { studentId } = req.params;

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
    }
 catch (error) {
        console.error('Error getting submissions:', error);
        res.status(500).json({ message: 'Error getting submissions' });
    }
};

exports.getAllSubmissions = async (req, res) => {
    try {
        const submissionsSnapshot = await db.collection('submissions').get();
        const usersSnapshot = await db.collection('users').get();

        const users = {};
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            users[doc.id] = {
                name: userData.name,
                email: userData.email,
            };
        });

        const allSubmissions = [];
        submissionsSnapshot.forEach(doc => {
            const submission = doc.data();
            const user = users[submission.studentId];
            if (user) {
                allSubmissions.push({
                    ...submission,
                    studentName: user.name,
                    studentEmail: user.email,
                });
            }
        });

        res.status(200).json(allSubmissions);
    }
 catch (error) {
        console.error('Error getting all submissions:', error);
        res.status(500).json({ message: 'Error getting all submissions' });
    }
};

exports.getStudentProjects = async (req, res) => {
    try {
        const evaluatorId = req.user.uid;
        
        // Get all submissions evaluated by the evaluator
        const submissionsSnapshot = await db.collection('submissions').where('evaluatorId', '==', evaluatorId).get();
        const studentIds = [...new Set(submissionsSnapshot.docs.map(doc => doc.data().studentId))];
        
        if (studentIds.length === 0) {
            return res.json([]);
        }
        
        // Get all projects for the students
        const projectsSnapshot = await db.collection('projects').where('author', 'in', studentIds).get();
        const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        res.json(projects);
    }
 catch (error) {
        console.error('Error getting student projects:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
