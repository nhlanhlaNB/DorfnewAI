import { useState, useEffect } from 'react';
import { initializeApp, FirebaseApp } from "firebase/app";
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCsUOwYavhzJsk3oa9utlxY7jAmmreGaO4",
  authDomain: "dorfnew-9f575.firebaseapp.com",
  projectId: "dorfnew-9f575",
  storageBucket: "dorfnew-9f575.firebasestorage.app",
  messagingSenderId: "690732549956",
  appId: "1:690732549956:web:b2199ce3f3b47924823911",
  measurementId: "G-CGFY15G69M",
};

let firebaseApp: FirebaseApp | null = null;

interface FirebaseState {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  analytics: Analytics | null;
  loading: boolean;
}

export function useFirebase() {
  const [firebase, setFirebase] = useState<FirebaseState>({
    app: null,
    auth: null,
    db: null,
    analytics: null,
    loading: true
  });

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Initialize Firebase App
        if (!firebaseApp) {
          firebaseApp = initializeApp(firebaseConfig);
        }

        // Initialize Auth
        const { getAuth, setPersistence, browserLocalPersistence } = await import('firebase/auth');
        const auth = getAuth(firebaseApp);
        
        await setPersistence(auth, browserLocalPersistence).catch((error) => {
          console.error("Error setting auth persistence:", error);
        });

        // Initialize Firestore
        const { getFirestore } = await import('firebase/firestore');
        const db = getFirestore(firebaseApp);

        // Initialize Analytics (optional)
        let analytics = null;
        try {
          const { getAnalytics, isSupported } = await import('firebase/analytics');
          const supported = await isSupported();
          if (supported) {
            analytics = getAnalytics(firebaseApp);
          }
        } catch (error) {
          console.warn('Analytics not supported:', error);
        }

        setFirebase({
          app: firebaseApp,
          auth,
          db,
          analytics,
          loading: false
        });
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        setFirebase(prev => ({ ...prev, loading: false }));
      }
    };

    if (typeof window !== 'undefined') {
      initializeFirebase();
    }
  }, []);

  return firebase;
}