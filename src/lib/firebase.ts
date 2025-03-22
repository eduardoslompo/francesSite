import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, updateProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_doqO0DPhdgnLPw8A4SLkJJZyAHhZugE",
  authDomain: "aprenderfrances-site.firebaseapp.com",
  projectId: "aprenderfrances-site",
  storageBucket: "aprenderfrances-site.appspot.com", // Corrigido de firebasestorage.app para appspot.com
  messagingSenderId: "350271355412",
  appId: "1:350271355412:web:11c6efc8505c2ce24e0501",
  measurementId: "G-WS1MKR4FDN"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics conditionally (to avoid errors in environments where it's not supported)
export const analytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

// Authentication functions
export const registerUser = async (email: string, password: string, displayName?: string) => {
  try {
    // Verify auth is properly initialized
    if (!auth) {
      throw new Error("Authentication not initialized");
    }
    
    // Check if Email/Password provider is enabled
    // This is a client-side check that will help identify configuration issues
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // If displayName is provided, update the user profile
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        displayName: displayName || "",
        role: "user",
        createdAt: new Date()
      });
      
      return userCredential.user;
    } catch (error: any) {
      // If we get configuration-not-found, it likely means Email/Password auth is not enabled
      if (error.code === 'auth/configuration-not-found') {
        console.error("Firebase Authentication configuration error: Email/Password provider may not be enabled in the Firebase console.");
        console.error("Please visit https://console.firebase.google.com/project/" + firebaseConfig.projectId + "/authentication/providers");
        console.error("and ensure that Email/Password authentication is enabled.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Function to check if a user is an admin
export const isUserAdmin = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role === 'admin';
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

// Function to set a user as admin (for development purposes)
export const setUserAsAdmin = async (userId: string) => {
  try {
    await setDoc(doc(db, "users", userId), {
      role: "admin"
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error setting user as admin:", error);
    throw error;
  }
};

// Function to change user password
export const changeUserPassword = async (currentPassword: string, newPassword: string) => {
  try {
    const user = auth.currentUser;
    
    if (!user || !user.email) {
      throw new Error("Usuário não está autenticado ou email não disponível");
    }
    
    // Reautenticar o usuário antes de alterar a senha
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    
    // Alterar a senha
    await updatePassword(user, newPassword);
    
    return true;
  } catch (error: any) {
    console.error("Erro ao alterar senha:", error);
    
    // Tratamento específico para erros comuns
    if (error.code === 'auth/wrong-password') {
      throw new Error("Senha atual incorreta");
    } else if (error.code === 'auth/weak-password') {
      throw new Error("A nova senha é muito fraca. Use pelo menos 6 caracteres");
    } else if (error.code === 'auth/requires-recent-login') {
      throw new Error("Sessão expirada. Faça login novamente para alterar sua senha");
    }
    
    throw error;
  }
};

// Function to update user display name
export const updateUserDisplayName = async (newDisplayName: string) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error("Usuário não está autenticado");
    }
    
    // Atualizar o nome no Firebase Authentication
    await updateProfile(user, {
      displayName: newDisplayName
    });
    
    // Atualizar o nome no Firestore também
    if (user.uid) {
      await setDoc(doc(db, "users", user.uid), {
        displayName: newDisplayName,
        updatedAt: new Date()
      }, { merge: true });
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao atualizar nome:", error);
    throw error;
  }
};
