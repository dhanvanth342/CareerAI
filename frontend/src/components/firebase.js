/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth}from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq0PCMPxvCa3IBL2w5Chh-VpivQWY6C6s",
  authDomain: "career-ai-22851.firebaseapp.com",
  projectId: "career-ai-22851",
  storageBucket: "career-ai-22851.firebasestorage.app",
  messagingSenderId: "501133705899",
  appId: "1:501133705899:web:cdf9903bacf7da5909adee",
  measurementId: "G-HS0EX26JD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;
*/
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq0PCMPxvCa3IBL2w5Chh-VpivQWY6C6s",
  authDomain: "career-ai-22851.firebaseapp.com",
  projectId: "career-ai-22851",
  storageBucket: "career-ai-22851.firebasestorage.app",
  messagingSenderId: "501133705899",
  appId: "1:501133705899:web:cdf9903bacf7da5909adee",
  measurementId: "G-HS0EX26JD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth=getAuth();
export const db=getFirestore(app);
export default app;