'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'lib/firebase';          // adjust if you placed it elsewhere

import Sidebar from '../../Components/Sidebar';
import Header from '../../Components/Header';
import MainContent from '../../Components/MainContent';
import styles from '../../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const generateClickRef = useRef<HTMLButtonElement | null>(null); // keep your ref

  // Check authentication status on mount
  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');     // not logged in → redirect
      } else {
        setIsLoading(false);       // logged in → render page
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader} />
        <p>Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header onGenerateClick={generateClickRef} />
        <MainContent onGenerateClick={generateClickRef} />
      </div>
    </div>
  );
}
