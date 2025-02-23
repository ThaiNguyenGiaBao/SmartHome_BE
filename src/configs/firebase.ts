import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
dotenv.config();

// Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase with try-catch
let storage: any;
try {
    const firebaseApp = initializeApp(firebaseConfig);
    storage = getStorage(firebaseApp);
    console.log("Firebase connected successfully.");
} catch (error) {
    console.error("Failed to connect to Firebase:", error);
}

export default storage;
