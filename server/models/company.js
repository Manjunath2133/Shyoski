export default class Company {
    constructor(name, owner) {
        this.name = name;
        this.owner = owner;
        this.members = [owner];
        this.projects = [];
        this.createdAt = new Date();
    }
}