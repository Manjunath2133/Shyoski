export default class User {
    constructor(id, email, role, name, photoUrl) {
        this.id = id;
        this.email = email;
        this.role = role; // student, evaluator, admin
        this.name = name;
        this.photoUrl = photoUrl;
        this.hasPaid = false;
        this.certificateId = null;
        this.bio = '';
        this.skills = [];
        this.socialLinks = {
            linkedin: '',
            twitter: '',
            github: '',
        };
        this.portfolio = [];
        this.billing = {
            plan: 'free', // free, basic, premium
            nextBillingDate: null,
            paymentHistory: [],
        };
    }
}