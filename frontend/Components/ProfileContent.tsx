/* eslint-disable @next/next/no-img-element */
"use client";
import React from 'react';
import styles from './ProfileContent.module.css';

export default function ProfileContent() {
    return (
        <div className={styles.content}>
            <h2>Recent Posts</h2>
            <div className={styles.post}>
                <img src="/post-image.jpg" alt="Post Image" />
                <h3>Post Title</h3>
                <p>This is a brief description of the post content...</p>
            </div>
            {/* Repeat for more posts */}
        </div>
    );
}
