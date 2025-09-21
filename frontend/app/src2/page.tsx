import { Suspense } from "react";
import LandingPageClient from "./components/LandingPage";
import styles from "../../styles/landing.module.css";

export default function Page() {
  return (
    <div className={styles.minHScreen}>
      <Suspense fallback={<div>Loading...</div>}>
        <LandingPageClient />
      </Suspense>
    </div>
  );
}