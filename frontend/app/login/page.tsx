"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail: string = email.trim().toLowerCase();
      
      // Use Firebase authentication instead of simulation
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        normalizedEmail, 
        password
      );
      
      // User is signed in
      const user = userCredential.user;
      console.log("User logged in:", user.uid);
      
      // Redirect to dashboard
      router.push("/dashboard");
      
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Handle specific Firebase errors
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

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <div className={styles.container}>
      {/* Decorative background elements */}
      <div className={styles.decorative1}></div>
      <div className={styles.decorative2}></div>
      <div className={styles.decorative3}></div>
      
      <div className={styles.card}>
        <div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

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

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
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
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg
                  className={styles.spinner}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
            Don&apos;t have an account?
            <button
              onClick={handleSignUp}
              className={styles.link}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}