import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, sendEmailVerification } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCsUOwYavhzJsk3oa9utlxY7jAmmreGaO4",
  authDomain: "dorfnew-9f575.firebaseapp.com",
  projectId: "dorfnew-9f575",
  storageBucket: "dorfnew-9f575.firebasestorage.app",
  messagingSenderId: "690732549956",
  appId: "1:690732549956:web:b2199ce3f3b47924823911",
  measurementId: "G-CGFY15G69M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Add storage initialization

// Set persistence for auth state
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

export { app, auth, db, storage, sendEmailVerification };
export const analytics = typeof window !== "undefined" ? (isSupported().then(supported => supported ? getAnalytics(app) : null)) : null;

