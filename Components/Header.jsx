import styles from '../styles/Header.module.css';
import React from 'react';

export default function Header() {
  return (
    <header className={styles.header}>
      <input
        type="text"
        placeholder="Search creators or topics"
        className={styles.searchBar}
      />
    </header>
  );
}
