import admin from 'firebase-admin';

// Initialize Firebase Admin (Only once)
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

export default async function handler(req, res) {
  // Only allow POST requests (Webhooks are always POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const body = req.body;
    console.log("Received Webhook from Superprofile:", JSON.stringify(body));

    // Superprofile webhooks usually send data inside a "data" object
    const payload = body.data || body;

    // Helper: extract email from text using regex
    const extractEmailFromText = (text) => {
      if (!text) return null;
      const match = String(text).match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
      return match ? match[0] : null;
    };

    // Extract the customer email — try direct fields first, then parse from email body
    let email = payload.customer_email
      || payload.email
      || payload.customer?.email;

    // If coming from Gmail notification (Make.com Gmail trigger path),
    // the "from" field is Superprofile's address — extract buyer email from body text
    if (!email || email.includes('superprofile') || email.includes('noreply') || email.includes('no-reply')) {
      email = extractEmailFromText(payload.body) || extractEmailFromText(payload.subject) || null;
    }

    console.log("Resolved customer email:", email);

    if (!email) {
      return res.status(400).json({ message: 'No customer email found in payload.' });
    }

    // Detect plan from product name / subject
    const productName = (payload.product_name || payload.subject || '').toLowerCase();
    let plan = 'Gold';
    let durationDays = 30;
    if (productName.includes('platinum')) { plan = 'Platinum'; durationDays = 30; }
    else if (productName.includes('gold')) { plan = 'Gold'; durationDays = 30; }

    // Connect to Firestore
    const db = admin.firestore();

    // Find the user by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log(`No user found with email: ${email}`);
      return res.status(404).json({ message: 'User not found.' });
    }

    const now = Date.now();
    const updates = {
      premium: true,
      premiumUntil: now + durationDays * 24 * 60 * 60 * 1000,
      plan
    };

    // Update all matching user documents (usually just one)
    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, updates);
    });
    
    await batch.commit();

    console.log(`Successfully upgraded user ${email} to Premium!`);
    return res.status(200).json({ message: 'Success', updatedEmail: email });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.toString() });
  }
}
