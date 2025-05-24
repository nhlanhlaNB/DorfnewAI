"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/../../app/src2/components/ui/use-toast";
import { supabase } from "@/../../backend/lib/supabase";

const Login = () => {
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

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      console.log("Login response:", { data, error });

      if (error) {
        throw error;
      }

      // Verify session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session created");

      // Check email confirmation
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("Failed to fetch user data");
      }

      if (!userData.user.email_confirmed_at) {
        throw new Error("Email not confirmed");
      }

      toast({ title: "Success", description: "Logged in successfully" });
      router.push("/dashboard");

    } catch (error) {
      console.error("Full login error:", error);

      let errorMessage = "Login failed";
      if (error instanceof Error) {
        switch (error.message) {
          case "Invalid login credentials":
            errorMessage = "Incorrect email or password";
            break;
          case "Email not confirmed":
            errorMessage = "Please check your email to confirm your account";
            break;
          case "No session created":
            errorMessage = "Session creation failed";
            break;
          default:
            errorMessage = error.message;
        }
      }

      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmation = async () => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      console.log("Resend confirmation response:", { data, error });
      if (error) throw error;
      toast({ title: "Success", description: "Confirmation email resent. Check your inbox or spam folder." });
    } catch (error) {
      console.error("Resend error:", error);
      toast({
        title: "Error",
        description: "Failed to resend confirmation email. Ensure the email is correct.",
        variant: "destructive",
      });
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
            <h1>Welcome back</h1>
            <p>Enter your credentials to sign in to your account</p>
          </div>

          <div className="auth-content">
            <form id="login-form" className="auth-form" onSubmit={handleSubmit}>
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
                <div className="forgot-password">
                  <Link href="/forgot-password">Forgot password?</Link>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary glow-button full-width"
                id="login-button"
                disabled={isLoading}
              >
                <span id="button-text">{isLoading ? "Signing in..." : "Sign in"}</span>
                {isLoading && <span id="button-loader" className="button-loader"></span>}
              </button>
            </form>

            <div className="resend-confirmation">
              <p>
                Didn't receive confirmation email?{" "}
                <button
                  onClick={resendConfirmation}
                  className="text-blue-500 hover:underline"
                  disabled={isLoading || !email}
                >
                  Resend
                </button>
              </p>
            </div>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link href="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;