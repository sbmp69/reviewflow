import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let app;
if (!getApps().length) {
  try {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
    const formattedKey = rawKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '');

    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: formattedKey,
      }),
    });
  } catch (error) {
    console.error("Firebase Admin Init Error:", error);
  }
} else {
  app = getApps()[0];
}

// Lazy initialization so it doesn't crash routes that don't need the DB
export const getAdminDb = () => getFirestore(app);
export const getAdminAuth = () => getAuth(app);

// Keep backwards compatibility for routes that import it directly
export const adminDb = new Proxy({} as any, { 
  get: (_, prop) => {
    const db = getFirestore(app);
    const value = (db as any)[prop];
    return typeof value === 'function' ? value.bind(db) : value;
  }
});

export const adminAuth = new Proxy({} as any, { 
  get: (_, prop) => {
    const auth = getAuth(app);
    const value = (auth as any)[prop];
    return typeof value === 'function' ? value.bind(auth) : value;
  }
});
