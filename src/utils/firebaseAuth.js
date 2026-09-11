import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

/**
 * Launches 1-click Google Sign-In popup.
 */
export async function signInWithGoogle() {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your .env credentials.');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

/**
 * Signs out active user.
 */
export async function signOutUser() {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out error:', error);
  }
}

/**
 * Subscribes to real-time auth state changes.
 */
export function subscribeToAuth(callback) {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}
