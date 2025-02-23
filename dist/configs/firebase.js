"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
dotenv_1.default.config();
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
let storage;
try {
    const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
    storage = (0, storage_1.getStorage)(firebaseApp);
    console.log("Firebase connected successfully.");
}
catch (error) {
    console.error("Failed to connect to Firebase:", error);
}
exports.default = storage;
