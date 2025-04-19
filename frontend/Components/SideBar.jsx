// Sidebar.js
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../styles/Sidebar.module.css";

export default function Sidebar() {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState("Home");

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
    const routes = {
      Home: "/",
      Library: "Library",
      Uploads: "/uploads",
      Notifications: "/Notifications",
      accountSettings: "/accountSettings",
      Channel: "/Channel",
      GetStarted: "SubscriptionPage", 
    };
    if (routes[buttonName]) {
      router.push(routes[buttonName]);
    }
  };
 
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>DORFNEW</span>
      </div>
      <nav className={styles.nav}>
        <ul>
          {["Home", "Library", "Uploads", "Notifications", "accountSettings", "Channel"].map((item) => (
            <li key={item}>
              <button
                className={`${styles.sidebarButton} ${activeButton === item ? styles.active : ""}`}
                onClick={() => handleButtonClick(item)}
              >
                <i className={`bi bi-${getIcon(item)} me-2`}></i>
                {item === "Library" ? "My Library" : item === "accountSettings" ? "Manage Account" : item === "Channel" ? "My Channel" : item}

              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.creatorBox}>
        <p className={styles.premiumText}>Unlock Premium Features</p>
        <button
          className={`${styles.sidebarButton} ${styles.getStarted} ${activeButton === "GetStarted" ? styles.active : ""}`}
          onClick={() => handleButtonClick("GetStarted")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

// Helper function to assign icons
function getIcon(item) {
  const icons = {
    Home: "house-fill",
    Library: "collection-fill",
    Uploads: "cloud-upload-fill",
    Notifications: "bell-fill",
    accountSettings: "gear-fill",
    Channel: "chat-fill",
  };
  return icons[item] || "circle";
}









