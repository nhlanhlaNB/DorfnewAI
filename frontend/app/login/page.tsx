"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  signInWithEmailAndPassword, 
  setPersistence, 
  browserLocalPersistence, 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider 
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { createOrUpdateUserProfile } from "../../lib/userProfile";
import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 🔒 Keep user logged in (local persistence)
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.error("Persistence error:", err);
    });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      const user = userCredential.user;
      await createOrUpdateUserProfile(user, "email");

      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => router.push("/forgot-password");
  const handleSignUp = () => router.push("/signup");

  // 🔑 Google login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createOrUpdateUserProfile(result.user, "google");
      router.push("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google sign-in failed.");
    }
  };

  // 🍏 Apple login
  const handleAppleLogin = async () => {
    try {
      const provider = new OAuthProvider("apple.com");
      const result = await signInWithPopup(auth, provider);
      await createOrUpdateUserProfile(result.user, "apple");
      router.push("/dashboard");
    } catch (err) {
      console.error("Apple login error:", err);
      setError("Apple sign-in failed.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.decorative1}></div>
      <div className={styles.decorative2}></div>
      <div className={styles.decorative3}></div>

      <div className={styles.card}>
        <div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <button
              type="button"
              onClick={handleForgotPassword}
              className={styles.forgotPassword}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* 🔑 Social login buttons */}
        <div className={styles.socialLogin}>
          <button onClick={handleGoogleLogin} className={styles.googleButton}>
            Continue with Google
          </button>
          <button onClick={handleAppleLogin} className={styles.appleButton}>
            Continue with Apple
          </button>
        </div>

        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <p style={{ color: "#d1d5db", fontSize: "0.9rem" }}>
            Don&apos;t have an account?
            <button onClick={handleSignUp} className={styles.link}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

