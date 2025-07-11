// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-yDHF8PyoqPcZ5dBiRAm7pbUPcwKBAhs",
  authDomain: "prep-867bc.firebaseapp.com",
  projectId: "prep-867bc",
  storageBucket: "prep-867bc.firebasestorage.app",
  messagingSenderId: "345665892451",
  appId: "1:345665892451:web:aee72f8c6f563c90ef4856",
  measurementId: "G-E8WGNDVZQ7",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
