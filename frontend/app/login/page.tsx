"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useToast } from "@/../../app/src2/components/ui/use-toast"; // Your path
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Sign in
      const { user } = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );

      // Get name from Firestore (optional)
      const userDoc = await getDoc(doc(db, "app_user", user.uid));
      const name = userDoc.exists() ? userDoc.data()?.name : null;
      if (name) setUserName(name);

      toast({
        title: "Login successful",
        description: name ? `Welcome back, ${name}` : "Redirecting...",
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);

      let message = "Login failed. Please try again.";
      switch (error.code) {
        case "auth/wrong-password":
        case "auth/user-not-found":
        case "auth/invalid-credential":
          message = "Incorrect email or password";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try again later.";
          break;
        default:
          message = error.message || message;
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
    <div className="auth-page">
      <div className="auth-back">
        <Link href="/" className="logo">DorfNewAI</Link>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome back{userName ? `, ${userName}` : ""}</h1>
            <p>Enter your credentials to sign in</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
              />
              <div className="forgot-password">
                <Link href="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary glow-button full-width"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {isLoading && <span className="button-loader" />}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don’t have an account? <Link href="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



