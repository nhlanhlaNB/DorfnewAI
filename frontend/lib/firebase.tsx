import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsUOwYavhzJsk3oa9utlxY7jAmmreGaO4",
  authDomain: "dorfnew-9f575.firebaseapp.com",
  projectId: "dorfnew-9f575",
  storageBucket: "dorfnew-9f575.appspot.com",
  messagingSenderId: "690732549956",
  appId: "1:690732549956:web:71de53b70bffa358823911"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set persistence for auth state
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

export { auth, db };
export default app;