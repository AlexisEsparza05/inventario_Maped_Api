require('dotenv').config();

const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://mapedmovil.firebasestorage.app'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };
