"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import styles from "./forgot-password.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      const actionCodeSettings = {
        url: "https://www.dorfnew.com/__/auth/action",
        handleCodeInApp: true,
      };
      
      await sendPasswordResetEmail(auth, normalizedEmail, actionCodeSettings);
      
      setEmailSent(true);
      
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email address.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        default:
          setError("Failed to send reset email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setEmail("");
    setError("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.decorative1}></div>
      <div className={styles.decorative2}></div>
      <div className={styles.decorative3}></div>
      
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <div className={`${styles.icon} ${emailSent ? styles.iconSuccess : ''}`}>
            {emailSent ? '✓' : '🔑'}
          </div>
        </div>

        <div>
          <h1 className={styles.title}>
            {emailSent ? 'Reset Email Sent!' : 'Forgot Password?'}
          </h1>
          <p className={styles.subtitle}>
            {emailSent 
              ? 'We sent a password reset link to your email address. Please check your inbox and follow the instructions.'
              : 'No worries! Enter your email address and we\'ll send you a link to reset your password.'
            }
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? (
                <div className={styles.buttonContent}>
                  <svg
                    className={styles.spinner}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending reset email...
                </div>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        ) : (
          <div className={styles.successContainer}>
            <button
              onClick={handleTryAgain}
              className={styles.secondaryButton}
            >
              Send another email
            </button>
            
            <div className={styles.successNote}>
              📧 Check your spam folder if you don&apos;t see the email in your inbox.
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Remember your password?
          </p>
          <button
            onClick={handleBackToLogin}
            className={styles.link}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}