// Import the functions you need from the SDKs you need
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore, GeoPoint, Timestamp, collection, addDoc, getDocs } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjLKIUWX2OpKcNjvIUeBSup-mA7IgFjIc",
  authDomain: "wastewise-f37f3.firebaseapp.com",
  projectId: "wastewise-f37f3",
  storageBucket: "wastewise-f37f3.appspot.com",
  messagingSenderId: "629664245072",
  appId: "1:629664245072:web:7b1081b88055bad825b855",
  measurementId: "G-NTM8XBDBT3"
};

// Initialize Firebase
// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);

// Initialize Firestore
const FIRESTORE_DB = getFirestore(FIREBASE_APP);

// Initialize Firebase Auth
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Firebase Storage
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export { FIREBASE_APP, FIRESTORE_DB, GeoPoint, Timestamp, collection, addDoc, getDocs, FIREBASE_STORAGE  };