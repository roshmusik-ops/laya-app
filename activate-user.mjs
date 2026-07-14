// activate-user.mjs
// Run: node activate-user.mjs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCwCOZoMwBggAh4PqdF1t1qcUOtWLDeFHs",
  authDomain: "laya-app-2026.firebaseapp.com",
  projectId: "laya-app-2026",
  storageBucket: "laya-app-2026.firebasestorage.app",
  messagingSenderId: "51785955505",
  appId: "1:51785955505:web:f44b082c055391876f0a90",
};

const TARGET_EMAIL = "rosh.musik@gmail.com";
const DAYS = 365; // activate for 1 year

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function activate() {
  console.log(`🔍 Searching for user: ${TARGET_EMAIL}`);
  
  const q = query(collection(db, "users"), where("email", "==", TARGET_EMAIL));
  const snap = await getDocs(q);

  if (snap.empty) {
    console.log("❌ No user found with that email in Firestore.");
    console.log("   (User might be stored by UID not email — trying all users...)");
    
    // Try fetching all users and checking manually
    const allSnap = await getDocs(collection(db, "users"));
    const found = allSnap.docs.find(d => d.data().email === TARGET_EMAIL);
    if (!found) {
      console.log("❌ Still not found. Make sure the user has logged in at least once.");
      process.exit(1);
    }
    await doUpdate(found);
  } else {
    await doUpdate(snap.docs[0]);
  }
}

async function doUpdate(docSnap) {
  const data = docSnap.data();
  const now = Date.now();
  const premiumUntil = now + DAYS * 24 * 60 * 60 * 1000;
  
  console.log(`✅ Found user: ${data.name || data.email} (ID: ${docSnap.id})`);
  
  await updateDoc(doc(db, "users", docSnap.id), {
    premium: true,
    plan: "Premium",
    premiumUntil,
    status: "approved",
  });
  
  console.log(`🎉 SUCCESS! ${TARGET_EMAIL} is now PREMIUM until ${new Date(premiumUntil).toLocaleDateString()}`);
  process.exit(0);
}

activate().catch(e => { console.error("Error:", e.message); process.exit(1); });
