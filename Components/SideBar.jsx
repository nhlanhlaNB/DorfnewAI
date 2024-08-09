import styles from '../styles/Sidebar.module.css';
import React from 'react';

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <logo>Goosebump</logo>
      </div>
      <nav>
        <ul>
          <li>Home</li>
          <li>Find creators</li>
          <li>Community</li>
          <li>Notifications</li>
          <li>Settings</li>
        </ul>
      </nav>
      <div className={styles.creatorBox}>
        <p>Become a creator</p>
        <button>Get started</button>
      </div>
    </div>
  );
}
