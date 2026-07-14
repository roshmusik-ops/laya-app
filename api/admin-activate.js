// api/admin-activate.js — serverless function to directly activate a user
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const SECRET = "laya-activate-2026";

function initAdmin() {
  if (getApps().length > 0) return;
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (sa) {
    initializeApp({ credential: cert(JSON.parse(sa)) });
  } else {
    initializeApp({
      credential: cert({
        projectId: "laya-app-2026",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      }),
    });
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { secret, email, days = 365 } = req.body || {};
  if (secret !== SECRET) return res.status(403).json({ error: "Forbidden" });
  if (!email) return res.status(400).json({ error: "email required" });

  try {
    initAdmin();
    const db = getFirestore();
    const snap = await db.collection("users").where("email", "==", email).get();

    if (snap.empty) {
      return res.status(404).json({ error: `No user found with email: ${email}` });
    }

    const userDoc = snap.docs[0];
    const now = Date.now();
    const premiumUntil = now + days * 24 * 60 * 60 * 1000;

    await userDoc.ref.update({
      premium: true,
      plan: "Premium",
      premiumUntil,
      status: "approved",
    });

    return res.status(200).json({
      success: true,
      message: `✅ ${email} is now PREMIUM until ${new Date(premiumUntil).toLocaleDateString("en-IN")}`,
      uid: userDoc.id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
