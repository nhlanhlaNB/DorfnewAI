import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";
import styles from "./verify-email.module.css";

export default function VerifyEmail() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailClient />
      </Suspense>
    </div>
  );
}  