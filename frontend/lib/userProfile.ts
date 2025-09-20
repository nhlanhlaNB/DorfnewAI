// lib/userProfile.js - Updated to include free trial tracking
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

type AuthProvider = string;
type TimestampValue = ReturnType<typeof serverTimestamp>;

interface AppUser {
  uid: string;
  email: string | null;
}

interface UserData {
  uid: string;
  email: string | null;
  provider: AuthProvider;
  freeGenerationsUsed: number;
  maxFreeGenerations: number;
  isSubscribed: boolean;
  subscriptionId: string | null;
  subscriptionDate: TimestampValue | null;
  updatedAt: TimestampValue;
  createdAt?: TimestampValue;
}

export const createOrUpdateUserProfile = async (user: AppUser, provider: AuthProvider): Promise<UserData> => {
  const userRef = doc(db, 'app_user', user.uid);
  
  // Check if user document already exists
  const userData: UserData = {
    uid: user.uid,
    email: user.email,
    provider: provider,
    freeGenerationsUsed: 0,
    maxFreeGenerations: 3,
    isSubscribed: false,
    subscriptionId: null,
    subscriptionDate: null,
    updatedAt: serverTimestamp(),
  };

  // Only set createdAt if it's a new user
  await setDoc(userRef, {
    ...userData,
    createdAt: serverTimestamp(),
  }, { merge: true });
  
  return userData;
};

