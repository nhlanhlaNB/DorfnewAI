"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../lib/firebase";
import styles from "./reset-password.module.css";

export default function ResetPasswordClient() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode");
  const email = searchParams.get("email") || "";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!oobCode) {
      setError("Invalid or missing reset code. Please request a new reset link.");
      return;
    }

    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSuccess(true);
      setTimeout(() => router.push("/login?message=Password reset successful. Please log in."), 3000);
    } catch (error: any) {
      console.error("Confirm password reset error:", error);
      switch (error.code) {
        case "auth/expired-action-code":
          setError("The reset link has expired. Please request a new one.");
          break;
        case "auth/invalid-action-code":
          setError("The reset link is invalid. Please request a new one.");
          break;
        case "auth/user-disabled":
          setError("Your account has been disabled. Contact support.");
          break;
        case "auth/weak-password":
          setError("Password is too weak. Please choose a stronger one.");
          break;
        default:
          setError("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>🔒</div>
      </div>

      <h1 className={styles.title}>
        {success ? "Password Reset Successful!" : "Reset Your Password"}
      </h1>
      <p className={styles.subtitle}>
        {success
          ? "Your password has been updated. Redirecting to login..."
          : `Enter a new password for ${email || "your account"}. It must be at least 6 characters.`}
      </p>

      {error && <div className={styles.error}>{error}</div>}

      {!success ? (
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      ) : null}

      <div className={styles.footer}>
        <button
          onClick={() => router.push("/login")}
          className={styles.link}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}