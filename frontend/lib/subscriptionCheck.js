import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export const checkSubscription = async (userId) => {
  try {
    const userDocRef = doc(db, 'app_user', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        canGenerate: userData.isSubscribed || 
                    (userData.freeGenerationsUsed < userData.maxFreeGenerations),
        freeGenerationsLeft: userData.maxFreeGenerations - (userData.freeGenerationsUsed || 0),
        isSubscribed: userData.isSubscribed || false
      };
    }
    
    return { canGenerate: false, freeGenerationsLeft: 0, isSubscribed: false };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return { canGenerate: false, freeGenerationsLeft: 0, isSubscribed: false };
  }
};

export const incrementGenerationCount = async (userId) => {
  try {
    const userDocRef = doc(db, 'app_user', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentCount = userData.freeGenerationsUsed || 0;
      
      await updateDoc(userDocRef, {
        freeGenerationsUsed: currentCount + 1
      });
      
      return currentCount + 1;
    }
    
    return 0;
  } catch (error) {
    console.error('Error incrementing generation count:', error);
    return 0;
  }
};