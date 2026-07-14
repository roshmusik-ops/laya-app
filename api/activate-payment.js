import admin from 'firebase-admin';

// Initialize Firebase Admin (Only once)
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { uid, email, plan } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: 'Missing uid or email.' });
    }

    // 🔒 Verify uid actually belongs to this email in Firebase Auth
    const userRecord = await admin.auth().getUser(uid);
    if (userRecord.email?.toLowerCase() !== email?.toLowerCase()) {
      return res.status(403).json({ message: 'Email does not match your Laya account.' });
    }

    const isPlatinum  = plan && plan.includes('plat');
    const isYearly    = plan && plan.includes('yearly');
    const durationDays = isYearly ? 365 : 30;
    const planName    = isPlatinum ? 'Platinum' : 'Gold';

    const db = admin.firestore();

    // 🚫 Block duplicate pending requests from same user
    const existing = await db.collection('activation_requests')
      .where('uid', '==', uid)
      .where('status', '==', 'pending')
      .get();

    if (!existing.empty) {
      return res.status(409).json({
        message: 'You already have a pending activation request. Please wait for admin approval.',
        status: 'already_pending'
      });
    }

    // ✅ Save as PENDING — admin must approve before account activates
    await db.collection('activation_requests').add({
      uid,
      email,
      plan:        planName,
      durationDays,
      status:      'pending',
      requestedAt: Date.now(),
      source:      'superprofile_web'
    });

    // 📧 Email admin notification via Resend
    const adminEmail = process.env.ADMIN_EMAIL;
    const resendKey  = process.env.RESEND_API_KEY;
    if (adminEmail && resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from:    'Laya App <noreply@laya.roshmusik.com>',
            to:      adminEmail,
            subject: `💰 New Payment Request — ${planName} (${durationDays}d)`,
            html: `
              <h2>💰 New Activation Request</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Plan:</strong> ${planName} (${durationDays} days)</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
              <hr/>
              <p>Login to your <a href="https://keralameet.vercel.app/app/profile">Admin Dashboard</a> → Payments tab to approve or reject.</p>
            `
          })
        });
      } catch (mailErr) {
        console.warn('Email notification failed:', mailErr);
      }
    }

    console.log(`📥 Activation request received: ${email} → ${planName}`);

    return res.status(200).json({
      message: `Request submitted! Your ${planName} account will be activated after payment verification (usually within a few hours).`,
      status:  'pending'
    });

  } catch (error) {
    console.error('Activation error:', error);
    return res.status(500).json({ message: 'Something went wrong. Please contact support.' });
  }
}
