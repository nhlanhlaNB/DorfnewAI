"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import styles from "./verify-email.module.css";

export default function VerifyEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "");
        if (user.emailVerified) {
          router.push("/dashboard");
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setMessage("Verification email sent successfully!");
      }
    } catch (error: any) {
      console.error("Resend error:", error);
      setError("Failed to send verification email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        router.push("/dashboard");
      } else {
        setMessage("Email not verified yet. Please check your inbox.");
      }
    } catch (error) {
      console.error("Error checking verification:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>📧</div>
        
        <h1 className={styles.title}>Verify Your Email</h1>
        
        <p className={styles.subtitle}>
          We&apos;ve sent a verification email to <strong>{email}</strong>. 
          Please check your inbox and click the link to verify your account.
        </p>
        
        {message && (
          <div className={styles.message}>
            {message}
          </div>
        )}
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        <div className={styles.actions}>
          <button
            onClick={handleResendEmail}
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? "Sending..." : "Resend Verification Email"}
          </button>
          
          <button
            onClick={handleCheckVerification}
            className={styles.secondaryButton}
          >
            I&apos;ve Verified My Email
          </button>
        </div>
        
        <p className={styles.footer}>
          Didn&apos;t receive the email? Check your spam folder or 
          <button onClick={handleResendEmail} className={styles.link}>
            try again
          </button>
        </p>
      </div>
    </div>
  );
}