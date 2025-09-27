"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Channel.module.css";

export default function MyChannel() {
  const router = useRouter();
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCloseClick = () => {
    router.push("/dashboard"); // Fixed: changed "/" to "/dashboard"
  };

  const handleCreateChannel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Creating channel:", { channelName, channelDescription, isPrivate });
    setChannelName("");
    setChannelDescription("");
    setIsPrivate(false);
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <button
          className={styles.closeButton}
          onClick={handleCloseClick}
          title="Back to Dashboard" // Also updated the title for clarity
          aria-label="Back to dashboard"
        >
          <i className="fas fa-times"></i>
        </button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>My Channel</h1>
        <p className={styles.pageSubtitle}>
          Create a channel to showcase your AI-generated content.
        </p>
        <div className={styles.channelContainer}>
          <div className={styles.channelCard}>
            <h2 className={styles.cardTitle}>Create Your Channel</h2>
            <p className={styles.cardDescription}>
              Set up a space for your AI creations, videos, and more.
            </p>
            <div className={styles.formContainer}>
              <div className={styles.formGroup}>
                <label htmlFor="channelName" className={styles.formLabel}>
                  Channel Name
                </label>
                <input
                  type="text"
                  id="channelName"
                  className={styles.formInput}
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  placeholder="Enter your channel name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="channelDescription" className={styles.formLabel}>
                  Description
                </label>
                <textarea
                  id="channelDescription"
                  className={styles.formTextarea}
                  value={channelDescription}
                  onChange={(e) => setChannelDescription(e.target.value)}
                  placeholder="Describe your channel"
                  rows={4}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formCheckboxLabel}>
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className={styles.formCheckbox}
                  />
                  Make channel private
                </label>
              </div>
              <button
                className={styles.actionButton}
                onClick={handleCreateChannel}
              >
                Create Channel
              </button>
            </div>
          </div>
          <div className={styles.channelCard}>
            <h2 className={styles.cardTitle}>Manage Content</h2>
            <p className={styles.cardDescription}>
              Upload and organize your AI-generated videos, images, or text.
            </p>
            <button className={styles.actionButton}>Go to Content</button>
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
