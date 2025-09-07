"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider 
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import styles from "./signup.module.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({ google: false, apple: false });
  const [error, setError] = useState("");

  const router = useRouter();
  const googleProvider = new GoogleAuthProvider();
  const appleProvider = new OAuthProvider('apple.com');

  // Set up Apple provider parameters
  appleProvider.addScope('email');
  appleProvider.addScope('name');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Basic validation
      if (!name || !email || !password) {
        setError("Please fill in all fields");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      // Update profile with name
      await updateProfile(user, {
        displayName: name
      });

      // Create user document in Firestore with error handling
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: normalizedEmail,
          createdAt: new Date(),
          emailVerified: false,
          role: "user",
          preferences: {},
          authProvider: "email"
        });
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
        // Don't throw error here - the user account was created successfully
      }

      // Send verification email
      await sendEmailVerification(user);

      // Redirect to verify-email page
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

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    setError("");

    try {
      const selectedProvider = provider === "google" ? googleProvider : appleProvider;
      const result = await signInWithPopup(auth, selectedProvider);
      const user = result.user;

      // Create user document in Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          createdAt: new Date(),
          emailVerified: user.emailVerified,
          role: "user",
          preferences: {},
          authProvider: provider
        }, { merge: true }); // Use merge to not overwrite existing data
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
      }

      // Redirect to dashboard
      router.push("/dashboard");
      
    } catch (error: any) {
      console.error(`${provider} signin error:`, error);
      
      let message = `Sign in with ${provider === "google" ? "Google" : "Apple"} failed.`;
      
      if (error.code === "auth/popup-closed-by-user") {
        message = "Sign in was canceled.";
      } else if (error.code === "auth/account-exists-with-different-credential") {
        message = "An account already exists with the same email address but different sign-in credentials.";
      } else if (error.code === "auth/operation-not-supported") {
        message = "This sign-in method is not supported in your browser.";
      }
      
      setError(message);
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      {/* Decorative background elements */}
      <div className={styles.decorative1}></div>
      <div className={styles.decorative2}></div>
      <div className={styles.decorative3}></div>
      
      <div className={styles.card}>
        <div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join DorfNewAI today</p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
            />
            <div className={styles.hint}>
              Must be at least 6 characters
            </div>
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
                Creating account...
              </div>
            ) : (
              "Sign up with Email"
            )}
          </button>
        </form>

        <div className={styles.divider}>
          <span>or</span>
        </div>
      {/* Social login buttons */}
        <div className={styles.socialButtons}>
          <button
            onClick={() => handleSocialSignIn("google")}
            disabled={socialLoading.google}
            className={`${styles.socialButton} ${styles.googleButton}`}
          >
            {socialLoading.google ? (
              <div className={styles.socialButtonContent}>
                <div className={styles.socialSpinner}></div>
                Signing in...
              </div>
            ) : (
              <div className={styles.socialButtonContent}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </div>
            )}
          </button>

          <button
            onClick={() => handleSocialSignIn("apple")}
            disabled={socialLoading.apple}
            className={`${styles.socialButton} ${styles.appleButton}`}
          >
            {socialLoading.apple ? (
              <div className={styles.socialButtonContent}>
                <div className={styles.socialSpinner}></div>
                Signing in...
              </div>
            ) : (
              <div className={styles.socialButtonContent}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
                </svg>
                Sign up with Apple
              </div>
            )}
          </button>
        </div>
      <div className={styles.footer}>
          <p className={styles.footerText}>
              Already have an account?{" "}
              <span
                onClick={handleLogin}
                className={styles.link}
              >
                Sign in
              </span>
            </p>
      </div>
      </div>
    </div>
  );
}