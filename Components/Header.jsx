"use client";
import styles from '../styles/Header.module.css';
import React from 'react';

export default function Header() {
  return (
    <header className={styles.header}>
      <input
        type="text"
        placeholder="Generate Videos, Images, music ect. Describe in words what you want!"
        className={styles.searchBar}
      />
    </header>
  );
}
