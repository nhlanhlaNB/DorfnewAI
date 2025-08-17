"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../styles/Sidebar.module.css";


// Define the type for navigation items and routes
type NavItem = "Home" | "Library" | "Uploads" | "Notifications" | "accountSettings" | "Channel" | "GetStarted";

interface Routes {
  [key: string]: string;
  Home: "/";
  Library: "/Library";
  Uploads: "/Uploads";
  Notifications: "/Notifications";
  accountSettings: "/accountSettings";
  Channel: "/Channel";
  GetStarted: "/SubscriptionPage";
}

export default function Sidebar() {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<NavItem>("Home");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleButtonClick = (buttonName: NavItem) => {
    setActiveButton(buttonName);
    const routes: Routes = {
      Home: "/",
      Library: "/Library",
      Uploads: "/Uploads",
      Notifications: "/Notifications",
      accountSettings: "/accountSettings",
      Channel: "/Channel",
      GetStarted: "/SubscriptionPage",
    };
    if (routes[buttonName]) {
      router.push(routes[buttonName]);
      setIsOpen(false); // Close sidebar on mobile after navigation
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={toggleSidebar}
        title="Toggle Menu"
        aria-label="Toggle sidebar menu"
      >
        <i className="fas fa-bars"></i>
      </button>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoText}>DORFNEW</span>
        </div>
        <nav className={styles.nav}>
          <ul>
            {(["Home", "Library", "Uploads", "Notifications", "accountSettings", "Channel"] as NavItem[]).map((item) => (
              <li key={item}>
                <button
                  className={`${styles.sidebarButton} ${activeButton === item ? styles.active : ""}`}
                  onClick={() => handleButtonClick(item)}
                >
                  <i className={`fas fa-${getIcon(item)} me-2`}></i>
                  {item === "Library"
                    ? "My Library"
                    : item === "accountSettings"
                    ? "Manage Account"
                    : item === "Channel"
                    ? "My Channel"
                    : item}
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
    </>
  );
}

// Helper function to assign Font Awesome icons
function getIcon(item: NavItem): string {
  const icons: { [key in NavItem]?: string } = {
    Home: "home",
    Library: "book",
    Uploads: "cloud-upload-alt",
    Notifications: "bell",
    accountSettings: "cog",
    Channel: "comment",
  };
  return icons[item] || "circle";
}