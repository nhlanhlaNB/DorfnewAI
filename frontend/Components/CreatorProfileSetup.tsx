"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import styles from '../styles/CreatorProfileSetup.module.css';

export default function CreatorProfileSetup() {
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [contentFiles, setContentFiles] = useState<File[]>([]);

  const handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleContentFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setContentFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!name || !bio || !profileImage || contentFiles.length === 0) {
      console.error('All fields are required');
      // Optionally, show a user-friendly error (e.g., toast notification)
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('profileImage', profileImage); // TypeScript now knows profileImage is File due to validation
    contentFiles.forEach((file, index) => {
      formData.append(`contentFile${index + 1}`, file);
    });

    try {
      const response = await fetch('/api/creators', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create profile');
      }

      const data = await response.json();
      console.log('Success:', data);
      // Redirect or update the UI upon success
    } catch (error) {
      console.error('Error:', error);
      // Handle errors (e.g., show a toast notification)
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create Your Profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="profileImage">Profile Image:</label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleProfileImageChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="contentFiles">Upload Your Content:</label>
          <input
            type="file"
            id="contentFiles"
            accept="image/*,video/*,audio/*"
            multiple
            onChange={handleContentFilesChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Create Profile
        </button>
      </form>
    </div>
  );
}
