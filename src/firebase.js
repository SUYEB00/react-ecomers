// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firebase Auth
import { getAuth } from "firebase/auth";

// (Optional) Import Analytics
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3GPSSN1PlBqt-1zjOrmMUCFWp3Q5PfSE",
  authDomain: "fir-63d48.firebaseapp.com",
  projectId: "fir-63d48",
  storageBucket: "fir-63d48.firebasestorage.app",
  messagingSenderId: "827205188404",
  appId: "1:827205188404:web:eae61ea0e2abb9a1064361",
  measurementId: "G-NJE9HC8YYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth (IMPORTANT)
export const auth = getAuth(app);

// Initialize Analytics (optional – will not break)
export const analytics = getAnalytics(app);
