// ─────────────────────────────────────────────────────────────────────────────
// KeralaМeet — Firebase Configuration
// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project named "keralameet"
// 3. Add a Web App (</> icon)
// 4. Copy your firebaseConfig object and paste it below
// 5. Enable these services in the Firebase Console:
//    - Authentication → Phone (enable)
//    - Firestore Database → Create in production mode
//    - Storage → Get started
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 👇 Load config from .env file
const firebaseConfig = {
  apiKey: "AIzaSyDBxwldSWATlG2sWZKTj3uavFNVV1YT0go",
  authDomain: "laya-new-2026.firebaseapp.com",
  projectId: "laya-new-2026",
  storageBucket: "laya-new-2026.firebasestorage.app",
  messagingSenderId: "519771329022",
  appId: "1:519771329022:web:d2c27334a460be855cf0af",
  measurementId: "G-GWZC7B5K63"
};

// ─────────────────────────────────────────────────────────────────────────────
// Agora App ID (for video/audio calls)
// ─────────────────────────────────────────────────────────────────────────────
export const AGORA_APP_ID = import.meta.env.VITE_AGORA_APP_ID;

// ─────────────────────────────────────────────────────────────────────────────
// Razorpay Key (for payments)
// ─────────────────────────────────────────────────────────────────────────────
export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
