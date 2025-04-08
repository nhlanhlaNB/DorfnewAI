"use client";  // Ensures this component is treated as a Client Component
import { useRouter } from 'next/navigation'; // Updated useRouter import for Next.js 13 App Router
import { useState } from 'react';
import styles from '../styles/Sidebar.module.css';

export default function Sidebar() {
  const router = useRouter(); // Initialize the router
  const [activeButton, setActiveButton] = useState('Home');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);

    // Conditional routing based on button name
    if (buttonName === "Get started") {
      router.push('/Screens#page'); // Navigate to the profile.js page
    } else if (buttonName === "Home") {
      router.push('/home'); // Navigate to the home.js page
    } else if (buttonName === "Find creators") {
      router.push('/find-creators'); // Navigate to the find creators page
      /*
    } else if (buttonName === "Share&Earn") {
      router.push('/Screens#share&earn'); // Navigate to the community page
      */
    } else if (buttonName === "Uploads") {
      router.push('/Uploads'); // Navigate to the upload page
    } else if (buttonName === "Notifications") {
      router.push('/notifications'); // Navigate to the notifications page
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoText}>DORFLECT</div>
      </div>
      <nav>
        <ul>
          <li>
            <button
              className={`${styles.sidebarButton} ${activeButton === "Home" ? styles.active : ""}`}
              onClick={() => handleButtonClick("Home")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`${styles.sidebarButton} ${activeButton === "Libriary" ? styles.active : ""}`}
              onClick={() => handleButtonClick("Libriary")}
            >
              My Libriary
            </button>
          </li>
          <li>
            <button
              className={`${styles.sidebarButton} ${activeButton === "Uploads" ? styles.active : ""}`}
              onClick={() => handleButtonClick("Uploads")}
            >
              Uploads   
            </button>
          </li>
          <li>
            <button
              className={`${styles.sidebarButton} ${activeButton === "Notifications" ? styles.active : ""}`}
              onClick={() => handleButtonClick("Notifications")}
            >
              Notifications
            </button>
          </li>
          <li>
            <button
              className={`${styles.sidebarButton} ${activeButton === "acoountSettings" ? styles.active : ""}`}
              onClick={() => handleButtonClick("accountSettings")}
            >
              Manage Account
            </button>
          </li>
          <li>
            <button
              className={`${styles.sidebarButton} ${activeButton === "Messages" ? styles.active : ""}`}
              onClick={() => handleButtonClick("Messages")}
            >
              Messages
            </button>     
            
          </li>
        </ul>
      </nav>
      <div className={styles.creatorBox}>
        <p>Try Premium</p>
        <button
          className={`${styles.sidebarButton} ${activeButton === "Get started" ? styles.active : ""}`}
          onClick={() => handleButtonClick("Get started")}
        >
          Get started
        </button>
      </div>
    </div>
  );
}








