import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
    User,
    UserCredential,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, firestore, googleProvider } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sign up with email and password
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    await updateProfile(result.user, {
      displayName: displayName,
    });

    // Create user document in Firestore (optional - won't fail if Firestore has issues)
    try {
      await createUserDocument(result.user, { displayName });
    } catch (firestoreError) {
      console.warn('Failed to create Firestore document, but authentication succeeded:', firestoreError);
    }
    
    return result;
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Create user document in Firestore if it doesn't exist (optional)
    try {
      await createUserDocument(result.user);
    } catch (firestoreError) {
      console.warn('Failed to create/update Firestore document, but authentication succeeded:', firestoreError);
    }
    
    return result;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Create user document in Firestore
export const createUserDocument = async (
  user: User,
  additionalData?: { displayName?: string }
): Promise<void> => {
  if (!user) return;

  try {
    const userDocRef = doc(firestore, 'users', user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      await setDoc(userDocRef, {
        displayName: additionalData?.displayName || displayName || '',
        email: email || '',
        photoURL: photoURL || '',
        createdAt,
        updatedAt: createdAt,
        ...additionalData,
      });
      
      console.log('User document created successfully');
    } else {
      console.log('User document already exists');
    }
  } catch (error) {
    console.error('Error creating user document:', error);
    // Don't throw error - allow authentication to proceed even if Firestore fails
    console.warn('Continuing without Firestore user document creation');
  }
};

// Get user document from Firestore
export const getUserDocument = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    const userSnapshot = await getDoc(userDocRef);
    
    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserProfile;
    }
    
    console.log('User document not found in Firestore');
    return null;
  } catch (error) {
    console.error('Error getting user document:', error);
    // Return null instead of throwing - allows app to continue without Firestore data
    return null;
  }
};