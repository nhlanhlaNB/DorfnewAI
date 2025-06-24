'use client'
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/../../backend/lib/supabase";
import Sidebar from '../../components/Sidebar';
import Header from "../../components/Header";
import MainContent from "../../components/MainContent";
import styles from "../../styles/Home.module.css"

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const generateClickRef = useRef(null); // Create ref for onGenerateClick

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Checking authentication...</p>
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