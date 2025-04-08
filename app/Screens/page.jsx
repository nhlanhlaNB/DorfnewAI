"use client"; // Marks this as a client component

import React, { useState } from 'react';

export default function Page() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [contentFiles, setContentFiles] = useState([]);
  const [price, setPrice] = useState('');
  const [payoutDetails, setPayoutDetails] = useState('');
  const [message, setMessage] = useState('');

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleContentFilesChange = (e) => {
    setContentFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('profileImage', profileImage);
    contentFiles.forEach((file, index) => {
      formData.append(`contentFile${index + 1}`, file);
    });
    formData.append('price', price);
    formData.append('payoutDetails', payoutDetails);

    fetch('/api/creators', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setMessage('Profile created successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('There was an error creating your profile.');
      });
  };

  const styles = {
    container: {
      maxWidth: '700px',
      margin: '0 auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
    },
    headerTitle: {
      textAlign: 'center',
      marginBottom: '30px',
      fontSize: '28px',
      fontWeight: '600',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    inputText: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      marginTop: '5px',
      transition: 'border-color 0.3s ease',
    },
    inputTextFocus: {
      borderColor: '#007bff',
    },
    fileInput: {
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
    },
    priceInput: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      marginTop: '5px',
    },
    payoutInput: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      marginTop: '5px',
    },
    submitButton: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s ease',
    },
    submitButtonHover: {
      backgroundColor: '#218838',
    },
    message: {
      textAlign: 'center',
      color: message.includes('error') ? 'red' : 'green',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.headerTitle}>Create Your Profile</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.inputText}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            rows="4"
            style={styles.inputText}
          ></textarea>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="profileImage">Profile Image:</label>
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={handleProfileImageChange}
            required
            style={styles.fileInput}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="contentFiles">Upload Your Content:</label>
          <input
            type="file"
            id="contentFiles"
            accept="image/*, video/*, audio/*"
            multiple
            onChange={handleContentFilesChange}
            required
            style={styles.fileInput}
          />
        </div>
        {/* Pricing for content */}
        <div style={styles.formGroup}>
          <label htmlFor="price">Set Price for Content:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price in USD"
            required
            style={styles.priceInput}
          />
        </div>
        {/* Payout details */}
        <div style={styles.formGroup}>
          <label htmlFor="payoutDetails">Payout Details:</label>
          <input
            type="text"
            id="payoutDetails"
            value={payoutDetails}
            onChange={(e) => setPayoutDetails(e.target.value)}
            placeholder="Enter your payout method (e.g., PayPal, bank account)"
            required
            style={styles.payoutInput}
          />
        </div>
        <button
          type="submit"
          style={styles.submitButton}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.submitButton.backgroundColor)}
        >
          Create Profile
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}


