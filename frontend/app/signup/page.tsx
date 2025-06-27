"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { auth, db } from "lib/firebase";           // adjust path
import { useToast } from "@/../../app/src2/components/ui/use-toast";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Signup() {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [isLoading, setBusy]  = useState(false);

  const router   = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // 1️⃣  Create user
      const { user } = await createUserWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );

      // 2️⃣  Attach display name (optional)
      await updateProfile(user, { displayName: name });

      // 3️⃣  Fire off verification e‑mail – **don’t await**
      sendEmailVerification(user).catch((err) =>
        console.error("sendEmailVerification:", err),
      );

      // 4️⃣  Store extra profile data
      await setDoc(doc(db, "app_user", user.uid), {
        id: user.uid,
        email: normalizedEmail,
        name,
        created_at: serverTimestamp(),
      });

      toast({
        title: "Account created!",
        description: "Check your inbox for the verification link.",
      });

      // 5️⃣  Off to the login page
      router.push("/login");
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      // Even if router.push hasn’t finished, clear the spinner
      setBusy(false);
    }
  };

  /* -------------------------------------------------- JSX -------------------------------------------------- */

  return (
    <div className="auth-page">
      <div className="auth-back">
        <Link href="/" className="logo">DorfNewAI</Link>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <header className="auth-header">
            <h1>Create Account</h1>
            <p>Sign up with DorfNewAI</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Name"
              />
            </div>

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
                onChange={(e) => setPass(e.target.value)}
                required
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary glow-button w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account…" : "Sign up"}
              {isLoading && <span className="button-loader" />}
            </button>
          </form>

          <footer className="auth-footer">
            <p>
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

