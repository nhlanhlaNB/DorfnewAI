"use client";

import { useState, MouseEvent, KeyboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  interface PreventableEvent {
    preventDefault: () => void;
  }

  const handleSubmit = async (e: PreventableEvent): Promise<void> => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const normalizedEmail: string = email.trim().toLowerCase();
      
      // Simulate login process (replace with your actual Firebase auth)
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      
      // Direct redirect to dashboard without popup
      router.push("/dashboard");
      
    } catch (err: unknown) {
      console.error("Login error:", err);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    router.push("/forgot-password");
  };

  const handleSignUp = () => {
    // Navigate to signup page  
    router.push("/signup");
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #2a2a40 0%, #1a1a2e 50%, #16213e 100%)',
    position: 'relative',
    overflow: 'hidden'
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transform: 'translateY(0)',
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 10
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #a855f7, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '10px'
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#d1d5db',
    fontSize: '1.1rem',
    marginBottom: '30px'
  };

  const inputGroupStyle: React.CSSProperties = {
    textAlign: 'left',
    marginBottom: '20px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#d1d5db',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '8px'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };

  const forgotPasswordStyle: React.CSSProperties = {
    color: '#06b6d4',
    fontSize: '0.9rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: 'transparent',
    transition: 'all 0.3s ease',
    marginBottom: '10px'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    opacity: isLoading ? 0.6 : 1,
    transform: isLoading ? 'none' : 'scale(1)',
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const linkStyle: React.CSSProperties = {
    color: '#06b6d4',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'color 0.3s ease',
    textDecoration: 'underline',
    textDecorationColor: 'transparent',
    marginLeft: '5px'
  };

  const decorativeStyle1: React.CSSProperties = {
    position: 'absolute',
    top: '40px',
    left: '40px',
    width: '80px',
    height: '80px',
    background: '#a855f7',
    borderRadius: '50%',
    opacity: 0.1,
    animation: 'pulse 2s infinite'
  };

  const decorativeStyle2: React.CSSProperties = {
    position: 'absolute',
    top: '120px',
    right: '80px',
    width: '64px',
    height: '64px',
    background: '#06b6d4',
    borderRadius: '50%',
    opacity: 0.1,
    animation: 'bounce 3s infinite'
  };

  const decorativeStyle3: React.CSSProperties = {
    position: 'absolute',
    bottom: '80px',
    left: '80px',
    width: '96px',
    height: '96px',
    background: '#8b5cf6',
    borderRadius: '50%',
    opacity: 0.1,
    animation: 'pulse 4s infinite'
  };

  return (
    <div style={containerStyle}>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .input-focus:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.2) !important;
        }
        .button-hover:hover {
          background: linear-gradient(90deg, #06b6d4, #7c3aed) !important;
          transform: scale(1.03) !important;
        }
        .card-hover:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
        }
        .link-hover:hover {
          color: #8b5cf6 !important;
          text-decoration-color: currentColor !important;
        }
        .forgot-hover:hover {
          color: #8b5cf6 !important;
          text-decoration-color: currentColor !important;
        }
      `}</style>
      
      {/* Decorative background elements */}
      <div style={decorativeStyle1}></div>
      <div style={decorativeStyle2}></div>
      <div style={decorativeStyle3}></div>
      
      <div style={cardStyle} className="card-hover">
        <div>
          <h1 style={titleStyle}>Welcome back</h1>
          <p style={subtitleStyle}>Sign in to your account</p>
        </div>

        <div>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              style={inputStyle}
              className="input-focus"
              placeholder="your@email.com"
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              style={inputStyle}
              className="input-focus"
              placeholder="••••••••"
              minLength={6}
              onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={handleForgotPassword}
              style={forgotPasswordStyle}
              className="forgot-hover"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            style={buttonStyle}
            className="button-hover"
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg
                  style={{ animation: 'spin 1s linear infinite', marginRight: '12px', width: '20px', height: '20px' }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    style={{ opacity: 0.25 }}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    style={{ opacity: 0.75 }}
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </button>
        </div>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
            Don&apos;t have an account?
            <button
              onClick={handleSignUp}
              style={linkStyle}
              className="link-hover"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}