/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import styles from './ProfileHeader.module.css';

export default function ProfileHeader() {
    return (
        <div className={styles.header}>
            <img className={styles.profilePic} src="/profile-pic.jpg" alt="Profile Picture" />
            <div className={styles.info}>
                <h1 className={styles.name}>Creator Name</h1>
                <p className={styles.bio}>This is a brief bio about the creator. They create amazing content!</p>
            </div>
        </div>
    );
}
