"use client";
import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
// Make sure you export your initialized Firebase app instance from this file
import { app } from "../lib/firebase";
import styles from "../styles/Header.module.css";

export default function Header({ onGenerateClick }) {
  const fileInputRef = useRef(null);
  const [userName, setUserName] = useState(null);
  const searchInputRef = useRef(null);

  // Firebase instances
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Fetch user name from Firestore on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // "app_user" collection uses the user's email as the document ID
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
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
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

  const handleGenerate = () => {
    const prompt = searchInputRef.current?.value.trim() || "";
    console.log("Generate clicked with prompt:", prompt);

    // Call the parent component's generation handler via ref
    if (onGenerateClick?.current) {
      onGenerateClick.current(prompt);
    } else {
      console.error("onGenerateClick ref is not defined");
    }
  };

  return (
    <header className={styles.header}>
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
      </div>
    </header>
  );
}
