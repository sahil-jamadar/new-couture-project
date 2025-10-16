import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTjq479Uo5stsEWJtQMjmSK0SgDdCHrCA",
  authDomain: "the-coutures.firebaseapp.com",
  projectId: "the-coutures",
  storageBucket: "the-coutures.firebasestorage.app",
  messagingSenderId: "507365103873",
  appId: "1:507365103873:web:3356055cba9b9e0adca300",
  measurementId: "G-P28TS0NP1S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;