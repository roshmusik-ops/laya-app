import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDBxwldSWATlG2sWZKTj3uavFNVV1YT0go",
  authDomain: "laya.roshmusik.com",
  projectId: "laya-new-2026",
  storageBucket: "laya-new-2026.firebasestorage.app",
  messagingSenderId: "519771329022",
  appId: "1:519771329022:web:d2c27334a460be855cf0af",
  measurementId: "G-GWZC7B5K63"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkKeys() {
  try {
    const keysRef = collection(db, "activationKeys");
    const q = query(keysRef, orderBy("createdAt", "desc"), limit(5));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log("No recent activation keys found.");
      return;
    }
    
    snapshot.forEach(doc => {
      console.log("Key ID:", doc.id, "=>", doc.data());
    });
  } catch (error) {
    console.error("Error fetching keys:", error);
    
    // Fallback: Just fetch all if orderBy fails due to missing index
    try {
        console.log("Trying without orderBy...");
        const snapshot2 = await getDocs(collection(db, "activationKeys"));
        let count = 0;
        snapshot2.forEach(doc => {
            count++;
            console.log("Key ID:", doc.id, "=>", doc.data());
        });
        if (count === 0) console.log("Still no keys.");
    } catch (e2) {
        console.error("Fallback failed:", e2);
    }
  }
}

checkKeys();
