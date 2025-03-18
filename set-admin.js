// Script to set an existing user as admin in Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_doqO0DPhdgnLPw8A4SLkJJZyAHhZugE",
  authDomain: "aprenderfrances-site.firebaseapp.com",
  projectId: "aprenderfrances-site",
  storageBucket: "aprenderfrances-site.appspot.com",
  messagingSenderId: "350271355412",
  appId: "1:350271355412:web:11c6efc8505c2ce24e0501",
  measurementId: "G-WS1MKR4FDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin user details
const adminEmail = 'eduardo5slompo@gmail.com';
const adminPassword = 'Useredu4696@';

async function setExistingUserAsAdmin() {
  try {
    console.log('Logging in as user...');
    
    // Sign in with email and password to get the user ID
    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log('User logged in with ID:', user.uid);
    
    // Set user as admin in Firestore
    await setDoc(doc(db, "users", user.uid), {
      role: "admin"
    }, { merge: true });
    
    console.log('User set as admin successfully!');
    console.log(`User with email ${adminEmail} now has admin privileges.`);
  } catch (error) {
    console.error('Error setting user as admin:', error);
  }
}

// Run the function
setExistingUserAsAdmin();