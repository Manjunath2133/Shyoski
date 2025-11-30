export default class Project {
    constructor(title, description, technologies, liveUrl, repoUrl, screenshots, author) {
        this.title = title;
        this.description = description;
        this.technologies = technologies;
        this.liveUrl = liveUrl;
        this.repoUrl = repoUrl;
        this.screenshots = screenshots;
        this.author = author;
        this.createdAt = new Date();
    }
}