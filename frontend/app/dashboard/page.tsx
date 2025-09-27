'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';
import Sidebar from '../../Components/SideBar';
import Header from '../../Components/Header';
import MainContent from '../../Components/MainContent';
import styles from '../../styles/Home.module.css';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);
  const [userDoc, setUserDoc] = useState<any>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const generateClickRef = useRef<((value: string) => void) | null>(null);

  // Initialize the generate function
  useEffect(() => {
    generateClickRef.current = (value: string) => {
      console.log('Generate clicked with value:', value);
    };
  }, []);

  // Check authentication + fetch user doc
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push('/login');
      } else {
        setUser(firebaseUser);

        // ✅ FIX: use UID not email
        const ref = doc(db, 'app_user', firebaseUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserDoc(snap.data());
        }
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleAddMember = async () => {
    if (!userDoc || userDoc.plan !== 'pro' || userDoc.role !== 'owner') {
      alert('Only Pro owners can invite members.');
      return;
    }

    if (userDoc.invitedMembers?.length >= 3) {
      alert('You can only invite up to 3 members.');
      return;
    }

    const newMemberUid = crypto.randomUUID(); // In real flow, they'd accept invite at signup

    // ✅ FIX: use UID for owner doc
    const ownerRef = doc(db, 'app_user', user.uid);
    await updateDoc(ownerRef, {
      invitedMembers: arrayUnion(newMemberUid),
    });

    // ✅ FIX: store member under UID, not email
    const memberRef = doc(db, 'app_user', newMemberUid);
    await setDoc(
      memberRef,
      {
        uid: newMemberUid,
        email: newMemberEmail,
        plan: 'pro',
        role: 'member',
        parentUid: user.uid,
      },
      { merge: true }
    );

    alert(`${newMemberEmail} added as a Pro member!`);
    setNewMemberEmail('');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader} />
        <p>Checking authentication…</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainArea}>
        <Header onGenerateClick={generateClickRef} />
        <MainContent onGenerateClick={generateClickRef} />

        {/* 🔹 Membership Management Section */}
        {userDoc?.plan === 'pro' && userDoc.role === 'owner' && (
          <div className={styles.membershipSection}>
            <h2>Manage Pro Members</h2>
            <input
              type="email"
              placeholder="Invite member email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
            />
            <button onClick={handleAddMember}>Add Member</button>

            <h3>Current Members:</h3>
            <ul>
              {userDoc.invitedMembers?.map((m: string, i: number) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

