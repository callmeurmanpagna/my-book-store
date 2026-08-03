const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin using environment variables.
// This is used ONLY to verify the Google ID token sent from the React frontend
// after a user signs in with Firebase Google Auth.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
    console.log('✅ Firebase Admin initialized');
  } catch (err) {
    console.warn('⚠️  Firebase Admin not initialized (Google login will fail):', err.message);
  }
}

module.exports = admin;
