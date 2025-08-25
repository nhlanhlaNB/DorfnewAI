"use client";
import React from "react";
import { useRouter } from "next/navigation";
//import styles from "./Uploads.module.css";
import styles from "../../styles/uploads.module.css";

export default function Uploads() {
  const router = useRouter();

  const handleCloseClick = () => {
    router.push("/");
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={handleCloseClick}
          title="Back to Home"
          aria-label="Back to Home"
        >
          <i className="fas fa-times"></i>
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Uploads</h1>
        <p className={styles.pageSubtitle}>
          Upload files to generate AI content or manage existing uploads.
        </p>
        <div className={styles.uploadContainer}>
          <div className={styles.uploadCard}>
            <h2 className={styles.cardTitle}>Upload New File</h2>
            <p className={styles.cardDescription}>
              Upload documents, images, or other files for AI processing.
            </p>
            <button className={styles.actionButton}>Start Upload</button>
          </div>
          <div className={styles.uploadCard}>
            <h2 className={styles.cardTitle}>Recent Uploads</h2>
            <p className={styles.cardDescription}>
              View and manage your recently uploaded files.
            </p>
            <button className={styles.actionButton}>View Uploads</button>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p className="mb-0">
          <i className="fas fa-copyright"></i> 2025 Dorfnew. All rights reserved.
        </p>
      </footer>
    </div>
  );
}