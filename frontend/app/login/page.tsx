"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../../styles/Login.module.css";
import { auth } from "../../lib/firebase";
import { useToast } from "@/../../app/src2/components/ui/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await signInWithEmailAndPassword(auth, normalizedEmail, password);

      toast({
        title: "Login successful",
        description: "Redirecting to your dashboard...",
      });

      // Redirect to dashboard after successful login
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Login error:", err);
      let message = "Login failed. Please try again.";

      if (err && typeof err === "object" && "code" in err) {
        const errorCode = (err as { code: string }).code;
        switch (errorCode) {
          case "auth/invalid-credential":
            message = "Invalid email or password";
            break;
          case "auth/user-not-found":
            message = "No account found with this email";
            break;
          case "auth/wrong-password":
            message = "Incorrect password";
            break;
          case "auth/too-many-requests":
            message =
              "Too many attempts. Try again later or reset your password.";
            break;
          case "auth/user-disabled":
            message = "This account has been disabled";
            break;
          case "auth/invalid-email":
            message = "Please enter a valid email address";
            break;
        }
      }

      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
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

          <Link href="/forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>

          <button type="submit" disabled={isLoading} className={styles.button}>
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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className={styles.signupText}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={styles.signupLink}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

