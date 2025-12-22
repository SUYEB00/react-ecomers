import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3GPSSN1PlBqt-1zjOrmMUCFWp3Q5PfSE",
  authDomain: "fir-63d48.firebaseapp.com",
  projectId: "fir-63d48",
  storageBucket: "fir-63d48.firebasestorage.app",
  messagingSenderId: "827205188404",
  appId: "1:827205188404:web:eae61ea0e2abb9a1064361",
  measurementId: "G-NJE9HC8YYR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const analytics = getAnalytics(app);