// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsUOwYavhzJsk3oa9utlxY7jAmmreGaO4",
  authDomain: "dorfnew-9f575.firebaseapp.com",
  projectId: "dorfnew-9f575",
  storageBucket: "dorfnew-9f575.firebasestorage.app",
  messagingSenderId: "690732549956",
  appId: "1:690732549956:web:71de53b70bffa358823911",
  measurementId: "G-GEDWXW3LNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;