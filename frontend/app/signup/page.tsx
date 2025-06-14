"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/../../app/src2/components/ui/use-toast";
import { supabase } from "@/../../backend/lib/supabase";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      console.log("Signup response:", { authData, authError });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("User creation failed");
      }

      // Check if email confirmation is required
      if (!authData.user.email_confirmed_at) {
        toast({
          title: "Check your email",
          description: "Please confirm your email to complete signup.",
        });
      }

      // Insert additional user data into the user table
      const { error: userError } = await supabase.from("app_user").insert({
        id: authData.user.id,
        email: normalizedEmail,
        name,
        created_at: new Date().toISOString(),
      });

      if (userError) {
        console.error("Insert error:", userError);
        throw userError;
      }

      router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-back">
        <Link href="/" className="logo">
          DorfNewAI
        </Link>
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Sign up with DorfNewAI</p>
          </div>
          <div className="auth-content">
            <form id="signup-form" className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary glow-button w-full"
                id="signup-button"
                disabled={isLoading}
              >
                <span id="button-text">{isLoading ? "Creating account..." : "Sign up"}</span>
                {isLoading && <span id="button-loader" className="button-loader"></span>}
              </button>
            </form>
          </div>
          <div className="auth-footer">
            <p>
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;