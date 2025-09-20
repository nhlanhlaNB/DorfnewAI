"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { createOrUpdateUserProfile } from "../../lib/userProfile";
import styles from "./signup.module.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    apple: false,
  });
  const [error, setError] = useState("");

  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const appleProvider = new OAuthProvider("apple.com");

  appleProvider.addScope("email");
  appleProvider.addScope("name");

  // Email/password signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!name || !email || !password) {
        setError("Please fill in all fields");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      // Save profile
      await createOrUpdateUserProfile(user, "email");

      await sendEmailVerification(user);
      router.push("/verify-email");
    } catch (error: any) {
      console.error("Signup error:", error);
      let message = "Signup failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message = "Email already in use. Try logging in instead.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/operation-not-allowed") {
        message = "Email/password accounts are not enabled. Please contact support.";
      }

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google/Apple sign-in
  const handleSocialSignIn = async (provider: "google" | "apple") => {
    setSocialLoading((prev) => ({ ...prev, [provider]: true }));
    setError("");

    try {
      const selectedProvider =
        provider === "google" ? googleProvider : appleProvider;
      const result = await signInWithPopup(auth, selectedProvider);
      const user = result.user;

      await createOrUpdateUserProfile(user, provider);

      router.push("/dashboard");
    } catch (error: any) {
      console.error(`${provider} signin error:`, error);
      let message = `Sign in with ${
        provider === "google" ? "Google" : "Apple"
      } failed.`;

      if (error.code === "auth/popup-closed-by-user") {
        message = "Sign in was canceled.";
      } else if (error.code === "auth/account-exists-with-different-credential") {
        message =
          "An account already exists with the same email address but different sign-in credentials.";
      } else if (error.code === "auth/operation-not-supported") {
        message = "This sign-in method is not supported in your browser.";
      }

      setError(message);
    } finally {
      setSocialLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Join DorfNewAI today</p>

        {error && <div className={styles.error}>{error}</div>}

        {/* Social buttons */}
        <div className={styles.socialButtons}>
          <button
            onClick={() => handleSocialSignIn("google")}
            disabled={socialLoading.google}
            className={`${styles.socialButton} ${styles.googleButton}`}
          >
            {socialLoading.google ? "Signing in..." : "Sign up with Google"}
          </button>

          <button
            onClick={() => handleSocialSignIn("apple")}
            disabled={socialLoading.apple}
            className={`${styles.socialButton} ${styles.appleButton}`}
          >
            {socialLoading.apple ? "Signing in..." : "Sign up with Apple"}
          </button>
        </div>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        {/* Email signup form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              className={styles.input}
              placeholder="John Doe"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
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
              minLength={6}
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={isLoading} className={styles.button}>
            {isLoading ? "Creating account..." : "Sign up with Email"}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Already have an account?{" "}
            <span onClick={handleLogin} className={styles.link}>
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

