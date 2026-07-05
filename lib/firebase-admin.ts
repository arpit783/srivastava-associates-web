import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw || privateKeyRaw.includes("your_private_key")) {
    return initializeApp({ projectId: projectId || "placeholder-project" }, `admin-${Date.now()}`);
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");

  // Firebase Storage bucket — try the env value first, fall back to appspot.com format
  const storageBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    `${projectId}.appspot.com`;

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });
}

export const adminDb = getFirestore(getAdminApp());
export const adminStorage = getStorage(getAdminApp());
