
"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../styles/Signup.module.css";
import { auth, db } from "../../lib/firebase";
import { useToast } from "app/src/components/ui/use-toast"
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Create user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      // Update profile
      await updateProfile(user, { displayName: name });

      // Send verification email
      await sendEmailVerification(user);

      // Create user document in app_user collection
      if (user.email) {
        await setDoc(doc(db, "app_user", user.email), {
          uid: user.uid,
          email: normalizedEmail,
          name,
          createdAt: serverTimestamp(),
          emailVerified: false,
        });
      }

      toast({
        title: "Account created!",
        description: "Verification email sent. Please check your inbox.",
      });

      // Redirect to verify-email page after a short delay
      setTimeout(() => {
        router.push("/verify-email");
      }, 1500);
    } catch (error: any) {
      console.error("Signup error:", error);
      let message = error.message;

      if (error.code === "auth/email-already-in-use") {
        message = "Email already in use. Try logging in instead.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address";
      }

      toast({
        title: "Signup failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join DorfNewAI today</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
            />
            <div className={styles.passwordHint}>
              Must be at least 6 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? (
              <>
                <svg
                  className={styles.spinner}
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating account...
              </>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link href="/login" className={styles.loginLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}