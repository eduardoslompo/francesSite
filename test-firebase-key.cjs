// Script to test if the Firebase key in .env.local is working correctly
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

try {
  console.log('Loading Firebase key from .env.local...');
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  
  console.log('Firebase key loaded successfully');
  console.log('Project ID:', serviceAccount.project_id);
  console.log('Private key ID:', serviceAccount.private_key_id);
  
  // Try to initialize Firebase with the key
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL
    });
  }
  
  console.log('Firebase initialized successfully - the key is valid!');
  
  // Test a simple Firebase operation
  console.log('Testing a simple Firebase operation...');
  admin.auth().listUsers(1)
    .then((listUsersResult) => {
      console.log('Successfully connected to Firebase Authentication');
      console.log(`Retrieved ${listUsersResult.users.length} user(s) from database`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error listing users:', error);
      process.exit(1);
    });
} catch (error) {
  console.error('Error with Firebase key:', error);
  process.exit(1);
}