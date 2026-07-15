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
    let userRecord;
    try {
      userRecord = await admin.auth().getUser(uid);
      if (userRecord.email?.toLowerCase() !== email?.toLowerCase()) {
        return res.status(403).json({ message: 'Email does not match your Laya account.' });
      }
    } catch (authErr) {
      console.warn('Auth check failed:', authErr.message);
      // Continue anyway — don't block the request
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
    const docRef = await db.collection('activation_requests').add({
      uid,
      email,
      plan:        planName,
      durationDays,
      status:      'pending',
      requestedAt: Date.now(),
      source:      'superprofile_web'
    });

    const requestId = docRef.id;

    // 📧 Send email via EmailJS REST API (free, no backend setup needed)
    const emailjsServiceId  = process.env.EMAILJS_SERVICE_ID;
    const emailjsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailjsPublicKey  = process.env.EMAILJS_PUBLIC_KEY;
    const emailjsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey && emailjsPrivateKey) {
      try {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id:  emailjsServiceId,
            template_id: emailjsTemplateId,
            user_id:     emailjsPublicKey,
            accessToken: emailjsPrivateKey,
            template_params: {
              to_email:    process.env.ADMIN_EMAIL || 'rosh.musik@gmail.com',
              user_email:  email,
              plan_name:   planName,
              duration:    `${durationDays} days`,
              request_id:  requestId,
              request_time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
              approve_link: `https://laya.roshmusik.com/app/admin`
            }
          })
        });
        console.log('📧 Email notification sent to admin');
      } catch (mailErr) {
        console.warn('EmailJS notification failed:', mailErr.message);
      }
    } else {
      // Fallback: Try Resend if available
      const resendKey = process.env.RESEND_API_KEY;
      const adminEmail = process.env.ADMIN_EMAIL || 'rosh.musik@gmail.com';
      if (resendKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from:    'Laya App <noreply@laya.roshmusik.com>',
              to:      adminEmail,
              subject: `💰 New Payment Request — ${planName} (${durationDays}d) from ${email}`,
              html: `
                <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px">
                  <h2 style="color:#ff6b6b">💰 New Activation Request</h2>
                  <table style="width:100%;border-collapse:collapse">
                    <tr><td style="padding:8px;color:#666">User Email:</td><td style="padding:8px;font-weight:bold">${email}</td></tr>
                    <tr><td style="padding:8px;color:#666">Plan:</td><td style="padding:8px;font-weight:bold">${planName} (${durationDays} days)</td></tr>
                    <tr><td style="padding:8px;color:#666">Request ID:</td><td style="padding:8px;font-family:monospace">${requestId}</td></tr>
                    <tr><td style="padding:8px;color:#666">Time (IST):</td><td style="padding:8px">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
                  </table>
                  <br/>
                  <a href="https://laya.roshmusik.com/app/admin" style="display:inline-block;padding:12px 28px;background:#ff6b6b;color:white;text-decoration:none;border-radius:8px;font-weight:bold;margin-top:16px">
                    ✅ Open Admin Dashboard to Approve
                  </a>
                  <p style="color:#999;font-size:12px;margin-top:24px">Check Payments tab in the dashboard.</p>
                </div>
              `
            })
          });
          console.log('📧 Resend email notification sent to admin');
        } catch (mailErr) {
          console.warn('Resend email notification failed:', mailErr.message);
        }
      }
    }

    console.log(`📥 Activation request received: ${email} → ${planName} (ID: ${requestId})`);

    return res.status(200).json({
      message: `Request submitted! Your ${planName} account will be activated after payment verification (usually within a few hours).`,
      status:  'pending'
    });

  } catch (error) {
    console.error('Activation error:', error);
    return res.status(500).json({ message: 'Something went wrong. Please contact support.' });
  }
}
