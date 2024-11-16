import admin from 'firebase-admin';
import serviceAccount from './service-account.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();