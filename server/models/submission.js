export default class Submission {
    constructor(studentId, week, repoUrl) {
        this.studentId = studentId;
        this.week = week;
        this.repoUrl = repoUrl;
        this.status = 'pending'; // pending, approved, rejected
        this.submittedAt = new Date();
        this.feedback = '';
    }
}