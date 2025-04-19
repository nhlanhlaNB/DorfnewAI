"use client";
import styles from "../styles/Header.module.css";
import React, { useRef } from "react";

export default function Header() {
  const fileInputRef = useRef(null); // Ref to trigger file input click

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Trigger hidden file input
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload (e.g., send to backend for generation)
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("/api/generate-from-file", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log("Generated content:", data); // Replace with actual UI update
      } catch (error) {
        console.error("Error generating from file:", error);
      }
    }
  };

  const handleGenerate = async () => {
    const prompt = document.querySelector("input").value;
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type: "video" }), // Example type
      });
      const data = await response.json();
      console.log("Generated content from text:", data); // Replace with UI update
    } catch (error) {
      console.error("Error generating from text:", error);
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
    </header>
  );
}