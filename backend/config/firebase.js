import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';

admin.initializeApp({
    credential: admin.credential.cert(path.resolve('config/serviceAccountKey.json')),
});

const db = getFirestore();

export default db;
