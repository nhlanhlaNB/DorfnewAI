"use client";

import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../lib/firebase";
import styles from "../styles/Header.module.css";
import mainStyles from "../styles/MainContent.module.css";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onGenerateClick: React.MutableRefObject<((value: string) => void) | null>;
  hideSearch?: boolean;
}

export default function Header({ onGenerateClick, hideSearch = false }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [userName, setUserName] = useState<string>("User");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState<boolean>(false);
  const [showMediaTypePrompt, setShowMediaTypePrompt] = useState<boolean>(false);
  const router = useRouter();

  const auth = getAuth(app);
  const db = getFirestore(app);

  const ADMIN_EMAIL = "nhlanhlabhengu99@gmail.com";

  const mediaTypes = [
    { name: "Video", colorClass: "mediaVideo" },
    { name: "Image", colorClass: "mediaImage" },
    { name: "Audio", colorClass: "mediaAudio" },
  ];

  // --- Fetch user info safely ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setUserEmail(user.email || null);

          // ✅ Use UID as doc ID to match Firestore rules
          const userDocRef = doc(db, "app_user", user.uid);
          const userSnap = await getDoc(userDocRef);

          const displayName =
            (userSnap.exists() && userSnap.data()?.name) ||
            user.displayName ||
            (user.email ? user.email.split("@")[0] : "User");

          setUserName(displayName);
        } catch (error: unknown) {
          console.error("Error fetching user:", (error as Error).message);
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

  // --- File upload handler ---
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    // ✅ Admin bypass
    if (auth.currentUser.email !== ADMIN_EMAIL) {
      try {
        const userDocRef = doc(db, "app_user", auth.currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        const isSubscribed = userSnap.exists() && userSnap.data()?.subscribed;

        if (!isSubscribed) {
          setShowPaymentPrompt(true);
          return;
        }
      } catch (error: unknown) {
        console.error("Error checking subscription:", (error as Error).message);
        setShowPaymentPrompt(true);
        return;
      }
    }

    // Proceed with file upload
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
    } catch (error: unknown) {
      console.error("Error generating from file:", (error as Error).message);
    }
  };

  // --- Media generation ---
  const handleGenerate = () => setShowMediaTypePrompt(true);

  const handleMediaTypeSelect = async (mediaType: string) => {
    const prompt = searchInputRef.current?.value.trim() || "";
    setShowMediaTypePrompt(false);

    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    // Admin bypass
    if (auth.currentUser.email === ADMIN_EMAIL) {
      onGenerateClick.current?.(`${prompt} ${mediaType.toLowerCase()}`);
      return;
    }

    try {
      const userDocRef = doc(db, "app_user", auth.currentUser.uid);
      const userSnap = await getDoc(userDocRef);
      const isSubscribed = userSnap.exists() && userSnap.data()?.subscribed;

      if (!isSubscribed) {
        setShowPaymentPrompt(true);
        return;
      }

      onGenerateClick.current?.(`${prompt} ${mediaType.toLowerCase()}`);
    } catch (error: unknown) {
      console.error("Error checking subscription:", (error as Error).message);
      setShowPaymentPrompt(true);
    }
  };

  // --- Sign out ---
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserName("User");
      setUserEmail(null);
      router.push("/login");
    } catch (error: unknown) {
      console.error("Sign out error:", (error as Error).message);
    }
  };

  const closePaymentPrompt = () => setShowPaymentPrompt(false);
  const closeMediaTypePrompt = () => setShowMediaTypePrompt(false);

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
              <button className={styles.cancelButton} onClick={closePaymentPrompt}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showMediaTypePrompt && (
        <div className={mainStyles.generationModal}>
          <div className={mainStyles.generationBox}>
            <h3>Select Media Type</h3>
            <div className={mainStyles.mediaTypeGrid}>
              {mediaTypes.map((type) => (
                <div
                  key={type.name}
                  className={`${mainStyles.topicCard} ${mainStyles[type.colorClass]}`}
                  onClick={() => handleMediaTypeSelect(type.name)}
                >
                  {type.name}
                </div>
              ))}
            </div>
            <button className={mainStyles.closeButton} onClick={closeMediaTypePrompt}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {!hideSearch && (
        <div className={styles.searchContainer}>
          <button
            className={styles.uploadButton}
            onClick={handleUploadClick}
            title="Upload a file to generate content"
            aria-label="Upload a file to generate content"
          >
            <i className="fas fa-cloud-upload-alt"></i>
          </button>
          <label htmlFor="fileInput" className={styles.hiddenLabel}>
            Upload file
          </label>
          <input
            id="fileInput"
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
            aria-label="Search or describe content to generate"
          />
          <button className={styles.generateButton} onClick={handleGenerate}>
            Generate
          </button>
        </div>
      )}

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

