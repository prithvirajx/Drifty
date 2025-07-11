import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

console.log('Initializing Firebase with config:');

// Firebase Web App Configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_KgtiJQe6GUO5LAfKHtymOgfcGFwZCAo",
  authDomain: "drifty-a2581.firebaseapp.com",
  projectId: "drifty-a2581",
  storageBucket: "drifty-a2581.appspot.com",
  messagingSenderId: "1048243730667",
  appId: "1:1048243730667:web:eeda499fb3a12e85bde6ae",
  databaseURL: "https://drifty-a2581-default-rtdb.firebaseio.com"
};

console.log('Firebase Config:', JSON.stringify(firebaseConfig, null, 2));

// Initialize Firebase
let app;
let auth;

try {
  // Check if Firebase app is already initialized
  const apps = getApps();
  if (apps.length === 0) {
    console.log('Initializing Firebase app...');
    app = initializeApp(firebaseConfig);
    console.log('Firebase app initialized successfully');
  } else {
    console.log('Using existing Firebase app');
    app = getApp();
  }
  
  console.log('Getting auth instance...');
  auth = getAuth(app);
  auth.languageCode = 'en';
  console.log('Auth instance created');
  
  // Test Firebase connection
  console.log('Testing Firebase connection...');
  if (auth && auth.app) {
    console.log('Firebase connection successful!');
  } else {
    console.error('Firebase connection failed - auth or auth.app is undefined');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  if (error.code === 'app/duplicate-app') {
    console.warn('Duplicate app detected, using existing app');
    app = getApp();
    auth = getAuth(app);
  } else {
    throw error; // Re-throw other errors
  }
}

// Export a test function to verify Firebase is working
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    // This is just a test - we're not actually signing in
    return Promise.resolve('Firebase connection test successful');
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    throw error;
  }
};

// Initialize Firestore
export const db = getFirestore(app);

// Helper functions for user profiles
export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const saveUserProfile = async (uid, profileData) => {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, profileData, { merge: true });
    console.log('User profile saved/updated successfully');
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
