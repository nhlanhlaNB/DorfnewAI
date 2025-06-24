"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/../../app/src2/components/ui/use-toast";
import { 
  signInWithEmailAndPassword,
  sendEmailVerification,
  User,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "@/../../backend/lib/firebase"; // Adjust path to your firebase config
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/../../backend/lib/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password
      );
      
      const user = userCredential.user;
      console.log("Login response:", user);

      // Check if email is verified
      if (!user.emailVerified) {
        toast({
          title: "Email not verified",
          description: "Please verify your email before logging in",
          variant: "destructive"
        });
        return;
      }

      // Fetch user name from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        throw new Error("User profile not found");
      }

      const userData = userDoc.data();
      const name = userData?.displayName || userData?.name || "User";
      setUserName(name);

      toast({
        title: "Success",
        description: `Welcome back, ${name}!`,
      });
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Full login error:", error);

      let errorMessage = "Login failed";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
        case "auth/user-not-found":
          errorMessage = "Incorrect email or password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Account temporarily disabled. Try again later";
          break;
        case "auth/user-disabled":
          errorMessage = "Account disabled";
          break;
        default:
          errorMessage = error.message || "Authentication failed";
      }

      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmation = async () => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      if (!currentUser.emailVerified) {
        await sendEmailVerification(currentUser);
        toast({ 
          title: "Success", 
          description: "Verification email resent. Check your inbox or spam folder." 
        });
      } else {
        toast({
          title: "Already Verified",
          description: "Your email is already verified",
        });
      }
    } catch (error: any) {
      console.error("Resend error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification email",
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
            <h1>Welcome back{userName ? `, ${userName}` : ""}</h1>
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