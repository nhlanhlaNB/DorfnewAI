import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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


// Set persistence for auth state
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

export { app, auth, db};
export const analytics = typeof window !== "undefined" ? (isSupported().then(supported => supported ? getAnalytics(app) : null)) : null;

/*import { initializeApp } from "firebase/app";

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

// Only initialize Firebase services on the client side
let auth = null;
let db = null;
let analytics = null;

if (typeof window !== 'undefined') {
  // Initialize Auth
  import('firebase/auth').then(({ getAuth, setPersistence, browserLocalPersistence }) => {
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Error setting auth persistence:", error);
    });
  });

  // Initialize Firestore
  import('firebase/firestore').then(({ getFirestore }) => {
    db = getFirestore(app);
  });

  // Initialize Analytics
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    });
  });
}

export { app, auth, db, analytics };
*/