import { Suspense } from "react";
import ForgotPasswordClient from "./ForgotPasswordClient";
import styles from "./forgot-password.module.css";

export default function ForgotPassword() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordClient />
      </Suspense>
    </div>
  );
}