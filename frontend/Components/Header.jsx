"use client";
import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../lib/firebase";
import styles from "../styles/Header.module.css";
import { useRouter } from "next/navigation";

export default function Header({ onGenerateClick }) {
  const fileInputRef = useRef(null);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState(null);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const searchInputRef = useRef(null);
  const router = useRouter();

  // Firebase instances
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Admin email
  const ADMIN_EMAIL = "nhlanhlabhengu99@gmail.com";

  // Fetch user data and subscription status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setUserEmail(user.email);
          const userDocRef = doc(db, "app_user", user.email);
          const userSnap = await getDoc(userDocRef);

          const displayName =
            (userSnap.exists() && userSnap.data()?.name) ||
            user.displayName ||
            user.email.split("@")[0] ||
            "User";

          setUserName(displayName);
        } catch (error) {
          console.error("Error fetching user:", error.message);
          setUserName("User");
        }
      } else {
        setUserName("User");
        setUserEmail(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, db, router]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check payment status before allowing file upload generation
      if (userEmail !== ADMIN_EMAIL) {
        const userDocRef = doc(db, "app_user", userEmail);
        const userSnap = await getDoc(userDocRef);
        const isSubscribed = userSnap.exists() && userSnap.data()?.subscribed;

        if (!isSubscribed) {
          setShowPaymentPrompt(true);
          return;
        }
      }

      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("/api/generate-from-file", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("File upload failed");
        const data = await response.json();
        console.log("Generated content from file:", data);
      } catch (error) {
        console.error("Error generating from file:", error.message);
      }
    }
  };

  const handleGenerate = async () => {
    const prompt = searchInputRef.current?.value.trim() || "";
    console.log("Generate clicked with prompt:", prompt);

    // Allow admin to bypass payment check
    if (userEmail === ADMIN_EMAIL) {
      if (onGenerateClick?.current) {
        onGenerateClick.current(prompt);
      } else {
        console.error("onGenerateClick ref is not defined");
      }
      return;
    }

    // Check subscription status for non-admin users
    try {
      const userDocRef = doc(db, "app_user", userEmail);
      const userSnap = await getDoc(userDocRef);
      const isSubscribed = userSnap.exists() && userSnap.data()?.subscribed;

      if (!isSubscribed) {
        setShowPaymentPrompt(true);
        return;
      }

      if (onGenerateClick?.current) {
        onGenerateClick.current(prompt);
      } else {
        console.error("onGenerateClick ref is not defined");
      }
    } catch (error) {
      console.error("Error checking subscription:", error.message);
      setShowPaymentPrompt(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserName("User");
      setUserEmail(null);
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  const closePaymentPrompt = () => {
    setShowPaymentPrompt(false);
  };

  return (
    <header className={styles.header}>
      {showPaymentPrompt && (
        <div className={styles.paymentModal}>
          <div className={styles.paymentModalContent}>
            <h2>Please Subscribe to Generate Content</h2>
            <p>
              To access content generation features, please choose a subscription plan.
              Unlock premium features and create without limits!
            </p>
            <div className={styles.paymentModalActions}>
              <button
                className={styles.subscribeButton}
                onClick={() => router.push("/subscription")}
              >
                View Subscription Plans
              </button>
              <button
                className={styles.cancelButton}
                onClick={closePaymentPrompt}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={styles.searchContainer}>
        <button
          className={styles.uploadButton}
          onClick={handleUploadClick}
          title="Upload a file to generate content"
        >
          <i className="fas fa-cloud-upload-alt"></i>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className={styles.fileInput}
          accept="image/*,video/*,audio/*"
          onChange={handleFileChange}
        />
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Generate Videos, Images, Music — Describe or Upload!"
          className={styles.searchBar}
        />
        <button className={styles.generateButton} onClick={handleGenerate}>
          Generate
        </button>
      </div>
      <div className={styles.userContainer}>
        <div className={styles.userGreeting}>
          Hello <span className={styles.userName}>{userName}</span>
        </div>
        <button className={styles.signOutButton} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </header>
  );
}