"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await signInWithEmailAndPassword(auth, normalizedEmail, password);

      alert("Login successful! Redirecting to your dashboard...");

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

      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <style jsx>{`
        .container {
          background: #2a2a40;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          padding: 20px;
        }

        .card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 30px;
          width: 100%;
          max-width: 400px;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .subtitle {
          font-size: 1.2rem;
          color: #b0b0c0;
          margin-bottom: 30px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .inputGroup {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }

        .label {
          font-size: 1rem;
          color: #b0b0c0;
        }

        .input {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px 15px;
          color: #ffffff;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .input:focus {
          outline: none;
          border-color: #7b68ee;
        }

        .forgotPassword {
          align-self: flex-end;
          color: #00ddeb;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s ease;
        }

        .forgotPassword:hover {
          color: #7b68ee;
        }

        .button {
          padding: 12px;
          background: linear-gradient(90deg, #7b68ee, #00ddeb);
          color: #ffffff;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .button:hover {
          background: linear-gradient(90deg, #00ddeb, #7b68ee);
          transform: scale(1.03);
        }

        .button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .signupText {
          color: #b0b0c0;
          font-size: 0.9rem;
          margin-top: 20px;
        }

        .signupLink {
          color: #00ddeb;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .signupLink:hover {
          color: #7b68ee;
        }

        .spinner {
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .card {
            padding: 20px;
          }
          
          .title {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
        }
      `}</style>

      <div className="container">
        <div className="card">
          <div className="header">
            <h1 className="title">Welcome back</h1>
            <p className="subtitle">Sign in to your account</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="your@email.com"
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <Link href="/forgot-password" className="forgotPassword">
              Forgot password?
            </Link>

            <button type="submit" disabled={isLoading} className="button">
              {isLoading ? (
                <>
                  <svg
                    className="spinner"
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

          <p className="signupText">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="signupLink">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

