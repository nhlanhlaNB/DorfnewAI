/*'use client'
import Sidebar from '../components/Sidebar';
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import styles from "../styles/Home.module.css";
import { useRouter } from 'next/navigation'

export default function Home() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header />
        <MainContent />

      </div>
    </div>
  );
}
*/


// app/page.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RedirectToLanding() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/src');
  }, [router]);

  return null; // Optionally show a loading spinner
}


