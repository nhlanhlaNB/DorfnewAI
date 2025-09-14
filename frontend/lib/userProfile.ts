import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function createOrUpdateUserProfile(user: any, provider: string, extra: any = {}) {
 const userRef = doc(db, "app_user", user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email || "",
      name: user.displayName || extra.name || "",
      createdAt: serverTimestamp(),
      emailVerified: user.emailVerified || false,
      authProvider: provider,
      plan: "free",
      role: "owner",
      parentUid: null,
      invitedMembers: [],
      preferences: {},
      ...extra,
    },
    { merge: true }
  );
}

