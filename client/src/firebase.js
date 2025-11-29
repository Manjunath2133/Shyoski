// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmjF03tAv8TiaGdqHs0-5L89CiGJfHrhI",
  authDomain: "shyoski-88e92.firebaseapp.com",
  projectId: "shyoski-88e92",
  storageBucket: "shyoski-88e92.appspot.com",
  messagingSenderId: "958867631804",
  appId: "1:958867631804:web:80c9df9428d3e17f7b2ab9",
  measurementId: "G-854VGEZGWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };