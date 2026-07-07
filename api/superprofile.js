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
    console.log("Received Webhook from Superprofile:", body);

    // Superprofile webhooks usually send data inside a "data" object
    const payload = body.data || body;
    
    // Extract the customer email
    const email = payload.customer_email || payload.email || payload.customer?.email;

    if (!email) {
      return res.status(400).json({ message: 'No email found in webhook payload.' });
    }

    // Connect to Firestore
    const db = admin.firestore();

    // Find the user by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log(`No user found with email: ${email}`);
      return res.status(404).json({ message: 'User not found.' });
    }

    // Determine what they bought
    // For now, we will default to granting 30 Days of Gold
    // You can customize this by checking `payload.product_name` or `payload.plan`
    const now = Date.now();
    const updates = {
      premium: true,
      premiumUntil: now + 30 * 24 * 60 * 60 * 1000, // 30 Days
      plan: "Gold"
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
