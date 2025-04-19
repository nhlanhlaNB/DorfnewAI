// components/CreatorProfileSetup.jsx
"use client";

import React, { useState } from 'react';
import styles from '../styles/CreatorProfileSetup.module.css';

export default function CreatorProfileSetup() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [contentFiles, setContentFiles] = useState([]);

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleContentFilesChange = (e) => {
    setContentFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission here, e.g., sending the data to a server or an API

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('profileImage', profileImage);
    contentFiles.forEach((file, index) => {
      formData.append(`contentFile${index + 1}`, file);
    });

    // Example API request (adjust the endpoint and method accordingly)
    fetch('/api/creators', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Redirect or update the UI upon success
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle errors
      });
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
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
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
            accept="image/*, video/*, audio/*"
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
