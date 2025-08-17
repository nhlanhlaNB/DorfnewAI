'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';   
import Sidebar from '../../Components/SideBar';
import Header from '../../Components/Header';
import MainContent from '../../Components/MainContent';
import styles from '../../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const generateClickRef = useRef<((value: string) => void) | null>(null);

  // Initialize the generate function
  useEffect(() => {
    generateClickRef.current = (value: string) => {
      console.log('Generate clicked with value:', value);
      // Add your generation logic here, e.g., call an API or update state
    };
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login'); // Not logged in → redirect
      } else {
        setIsLoading(false); // Logged in → render page
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