/**
 * Clears all Firestore data so client can start fresh.
 * Run: node scripts/clear-db.js
 */

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
require("dotenv").config({ path: ".env.local" });

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);

const TOP_LEVEL_COLLECTIONS = [
  "records",
  "referrals",
  "callbacks",
  "uploadTokens",
  "unknownWhatsAppSenders",
  // Leave these intact — they are config, not operational data:
  // "bankRates"
  // "testimonials"
];

async function deleteCollection(colRef, label) {
  const snap = await colRef.get();
  if (snap.empty) {
    console.log(`  ✓ ${label} — already empty`);
    return 0;
  }

  let total = 0;
  for (const doc of snap.docs) {
    // Delete subcollections first
    const subCols = await doc.ref.listCollections();
    for (const sub of subCols) {
      const subSnap = await sub.get();
      const batch = db.batch();
      subSnap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      total += subSnap.size;
    }
    await doc.ref.delete();
    total++;
  }

  console.log(`  ✓ ${label} — deleted ${total} documents`);
  return total;
}

async function main() {
  console.log("\n🗑️  Starting Firestore cleanup...\n");
  let grand = 0;
  for (const name of TOP_LEVEL_COLLECTIONS) {
    grand += await deleteCollection(db.collection(name), name);
  }
  console.log(`\n✅  Done. Total documents deleted: ${grand}\n`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
