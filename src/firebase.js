import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDYfLJ4ZXmja3QD0urdQkFRfipES6yvfY",
  authDomain: "https://www.trenzone.xyz/",
  projectId: "trendzonelive-8ad9d",
  storageBucket: "trendzonelive-8ad9d.firebasestorage.app",
  messagingSenderId: "615872759803",
  appId: "1:615872759803:web:a37de39ef03599c7ba6d5e",
  measurementId: "G-77LWWKZ3L1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const analytics = getAnalytics(app);