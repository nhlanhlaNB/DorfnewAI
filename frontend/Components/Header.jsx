"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/../../backend/lib/supabase";
import styles from "../styles/Header.module.css";

export default function Header({ onGenerateClick }) {
  const fileInputRef = useRef(null);
  const [userName, setUserName] = useState(null);
  const searchInputRef = useRef(null);

  // Fetch user name from Supabase users table on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (user) {
          const { data, error } = await supabase
            .from('app_user')
            .select('name')
            .eq('email', user.email)
            .single();

          if (error) throw error;

          const displayName = data?.name || user.email?.split('@')[0] || 'User';
          setUserName(displayName);
        } else {
          setUserName('User');
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
        setUserName('User');
      }
    };

    fetchUser();
  }, []);

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
    console.log("Generate clicked with prompt:", prompt); // Debugging

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