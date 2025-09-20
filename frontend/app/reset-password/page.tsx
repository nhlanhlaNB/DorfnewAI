import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";
import styles from "./reset-password.module.css";

export default function ResetPassword() {
  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  );
}