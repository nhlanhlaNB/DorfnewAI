
"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "../../lib/firebase";
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

      alert("Account created! Verification email sent. Please check your inbox.");

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
          padding: 40px;
          width: 100%;
          max-width: 450px;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .header {
          margin-bottom: 30px;
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
          margin-bottom: 0;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 25px;
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
          font-weight: 500;
        }

        .input {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 14px 18px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .input:focus {
          outline: none;
          border-color: #7b68ee;
          box-shadow: 0 0 0 3px rgba(123, 104, 238, 0.2);
        }

        .input::placeholder {
          color: rgba(180, 180, 200, 0.6);
        }

        .passwordHint {
          color: #7b68ee;
          font-size: 0.85rem;
          margin-top: 5px;
          font-weight: 500;
        }

        .button {
          padding: 16px;
          background: linear-gradient(90deg, #7b68ee, #00ddeb);
          color: #ffffff;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .button:hover {
          background: linear-gradient(90deg, #00ddeb, #7b68ee);
          transform: scale(1.03);
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loginText {
          color: #b0b0c0;
          font-size: 1rem;
          margin-top: 25px;
        }

        .loginLink {
          color: #00ddeb;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
          margin-left: 5px;
        }

        .loginLink:hover {
          color: #7b68ee;
        }

        .spinner {
          animation: spin 1s linear infinite;
          margin-right: 12px;
          width: 20px;
          height: 20px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .card {
            padding: 30px 20px;
            max-width: 100%;
          }
          
          .title {
            font-size: 2.2rem;
          }
          
          .subtitle {
            font-size: 1.1rem;
          }
          
          .form {
            gap: 20px;
          }
          
          .input {
            padding: 12px 16px;
          }
          
          .button {
            padding: 14px;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .title {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1rem;
          }
          
          .container {
            padding: 15px;
          }
        }
      `}</style>

      <div className="container">
        <div className="card">
          <div className="header">
            <h1 className="title">Create Account</h1>
            <p className="subtitle">Join DorfNewAI today</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="John Doe"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
              <div className="passwordHint">
                Must be at least 6 characters
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button"
            >
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
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <p className="loginText">
            Already have an account?{" "}
            <Link href="/login" className="loginLink">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}