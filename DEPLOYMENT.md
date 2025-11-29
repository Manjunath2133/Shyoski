# Deploying a MERN Stack Application

This document provides a general guide on how to deploy a MERN (MongoDB, Express, React, Node.js) stack application.

## Prerequisites

*   A cloud provider account (e.g., AWS, Google Cloud, Heroku, Vercel, Netlify)
*   A MongoDB Atlas account (or other managed MongoDB service)
*   Node.js and npm installed on your local machine
*   Git installed on your local machine

## Backend Deployment (Node.js and Express)

We recommend using a platform like Heroku or AWS Elastic Beanstalk for deploying the backend.

### Heroku

1.  **Create a Heroku account:** If you don't have one, create a new account at [heroku.com](https://www.heroku.com/).
2.  **Install the Heroku CLI:** Follow the instructions at [devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli) to install the Heroku CLI on your local machine.
3.  **Login to Heroku:** Open a terminal and run `heroku login`.
4.  **Create a new Heroku app:** Navigate to your `server` directory and run `heroku create`. This will create a new Heroku app and a new Git remote.
5.  **Set environment variables:** You'll need to set the following environment variables in your Heroku app:
    *   `MONGODB_URI`: The connection string for your MongoDB Atlas database.
    *   `FIREBASE_SERVICE_ACCOUNT`: The content of your `firebase-service-account.json` file.
    *   `PORT`: This is set automatically by Heroku.
6.  **Deploy to Heroku:** Run `git push heroku main` to deploy your backend to Heroku.

## Frontend Deployment (React)

We recommend using a platform like Vercel or Netlify for deploying the frontend.

### Vercel

1.  **Create a Vercel account:** If you don't have one, create a new account at [vercel.com](https://vercel.com/).
2.  **Install the Vercel CLI:** Run `npm install -g vercel`.
3.  **Login to Vercel:** Run `vercel login`.
4.  **Deploy to Vercel:** Navigate to your `client` directory and run `vercel`. This will deploy your React app to Vercel.

## MongoDB Atlas

1.  **Create a MongoDB Atlas account:** If you don't have one, create a new account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2.  **Create a new cluster:** Create a new cluster. The free tier is a good option for small projects.
3.  **Get the connection string:** Once your cluster is created, get the connection string for your application. You'll need to whitelist your IP address and create a new database user.

## Final Steps

1.  **Update the API URL in your frontend:** In your React app, you'll need to update the API URL to point to your deployed backend. You can use an environment variable for this.
2.  **CORS:** You may need to configure CORS on your backend to allow requests from your frontend's domain.

This is a general guide. The exact steps may vary depending on your chosen cloud provider and your application's specific configuration.
