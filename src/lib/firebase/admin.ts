import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    // Vercel sometimes double-escapes newlines or wraps them in quotes
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
    const formattedKey = rawKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '');

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
      }),
    });
  } catch (error) {
    console.error("Firebase Admin Init Error:", error);
  }
}

const adminDb = getFirestore();
const adminAuth = getAuth();

export { adminDb, adminAuth };
