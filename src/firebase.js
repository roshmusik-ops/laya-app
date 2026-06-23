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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
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
