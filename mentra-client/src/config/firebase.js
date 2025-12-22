// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWvaN4Jn67Vji_lnQhuvg2gGuGD8hQHBI",
  authDomain: "mentra-a0815.firebaseapp.com",
  projectId: "mentra-a0815",
  storageBucket: "mentra-a0815.firebasestorage.app",
  messagingSenderId: "519614593881",
  appId: "1:519614593881:web:c2595bddf546ed5b0e6a48",
  measurementId: "G-FBNK16R8BJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
  login_hint: 'user@example.com'
});

// Auth functions with improved error handling
export const signInWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    // Handle popup blocked or CORS errors by falling back to redirect
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      console.log('Popup blocked, falling back to redirect...');
      await signInWithRedirect(auth, googleProvider);
      return await getRedirectResult(auth);
    }
    throw error;
  }
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

export const updateUserProfile = async (user, profile) => {
  return await updateProfile(user, profile);
};

export default app;
