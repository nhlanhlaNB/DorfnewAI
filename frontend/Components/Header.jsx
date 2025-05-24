"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/../../New/Final DorfnewAI/DorfnewAI/backend/lib/supabase";
import styles from "../styles/Header.module.css";

export default function Header() {
  const fileInputRef = useRef(null);
  const [userName, setUserName] = useState(null);

  // Fetch user name from Supabase users table on component mount
 useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        if (user) {
          const { data, error } = await supabase
            .from('user')
            .select('name')
            .eq('email', user.email)
            .single();

          const displayName = data?.name || user.email?.split('@')[0] || 'User';
          setUserName(displayName);
        } else {
          setUserName('User');
        }
      } catch (error) {
        console.error("Error fetching user:", error);
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
        const data = await response.json();
        console.log("Generated content:", data);
      } catch (error) {
        console.error("Error generating from file:", error);
      }
    }
  };

  const handleGenerate = async () => {
    if (typeof document !== 'undefined') {
      const input = document.querySelector("input[type='text']");
      const prompt = input ? input.value : '';
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, type: "video" }),
        });
        const data = await response.json();
        console.log("Generated content from text:", data);
      } catch (error) {
        console.error("Error generating from text:", error);
      }
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