import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAIDbgno4i7L5OxCa7fDr0JDAsAjmFWFsU",
    authDomain: "mystic-cards-151ad.firebaseapp.com",
    projectId: "mystic-cards-151ad",
    storageBucket: "mystic-cards-151ad.firebasestorage.app",
    messagingSenderId: "489403198813",
    appId: "1:489403198813:web:bde2a0c50e93665e27ccb4",
    measurementId: "G-YK0ERYPMXH"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
