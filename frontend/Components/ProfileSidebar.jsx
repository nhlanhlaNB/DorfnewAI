"use client";
import React from 'react';
import styles from './ProfileSidebar.module.css';

export default function ProfileSidebar() {
    return (
        <div className={styles.sidebar}>
            <ul>
                <li><a href="#posts">Posts</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#support">Support</a></li>
            </ul>
        </div>
    );
}
