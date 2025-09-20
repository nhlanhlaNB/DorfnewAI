"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import styles from "./verify-email.module.css";

export default function VerifyEmailClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "");
        if (user.emailVerified) {
          router.push("/login?message=Email verified successfully");
        }
      } else {
        router.push("/login?error=Please sign in to verify your email");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleResendEmail = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user, {
          url: "https://www.dorfnew.com/__/auth/action",
          handleCodeInApp: true,
        });
        setMessage("Verification email sent successfully! Please check your inbox.");
      } else {
        setError("No user is signed in. Please log in again.");
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Resend error:", error);
      switch (error.code) {
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Failed to send verification email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        router.push("/login?message=Email verified successfully");
      } else {
        setMessage("Email not verified yet. Please check your inbox or spam folder.");
      }
    } catch (error: any) {
      console.error("Error checking verification:", error);
      setError("Failed to check verification status. Please try again.");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.icon}>📧</div>

      <h1 className={styles.title}>Verify Your Email</h1>

      <p className={styles.subtitle}>
        We&apos;ve sent a verification email to <strong>{email}</strong>. Please check your inbox and click the link to verify your account.
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
          {isLoading ? (
            <span>
              <span className={styles.spinner}></span>
              Sending...
            </span>
          ) : (
            "Resend Verification Email"
          )}
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
  );
}