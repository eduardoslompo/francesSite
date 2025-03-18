// Script to create an admin user in Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection } from 'firebase/firestore';

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
const adminEmail = 'admin@admin.com';
const adminPassword = 'Useredu4696@'; // You should use a stronger password in production
const adminDisplayName = 'Admin User';

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const user = userCredential.user;
    
    console.log('User created with ID:', user.uid);
    
    // Update profile with display name
    await updateProfile(user, {
      displayName: adminDisplayName
    });
    
    // Create user document in Firestore with admin role
    await setDoc(doc(db, "users", user.uid), {
      email: adminEmail,
      displayName: adminDisplayName,
      role: "admin",
      createdAt: new Date()
    }, { merge: true });
    
    console.log('User set as admin successfully!');
    console.log('You can now log in with:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.error('Error: This email is already in use. If you need to set an existing user as admin, use the setUserAsAdmin function instead.');
    } else {
      console.error('Error creating admin user:', error);
    }
  }
}

// Run the function
createAdminUser();