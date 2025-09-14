// pages/api/account/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestoreAdmin } from 'lib/firebaseAdmin';
import { getUidFromReq } from 'lib/serverUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const uid = await getUidFromReq(req);
    const userDoc = await firestoreAdmin.collection('users').doc(uid).get();
    if (!userDoc.exists) return res.status(200).json({ account: null });

    const user = userDoc.data()!;
    if (!user.accountId) return res.status(200).json({ account: null });

    const accountRef = firestoreAdmin.collection('accounts').doc(user.accountId);
    const accountSnap = await accountRef.get();
    const membersSnap = await accountRef.collection('members').get();
    const members = membersSnap.docs.map(d => d.data());
    return res.status(200).json({ account: { id: accountRef.id, ...accountSnap.data(), members } });
  } catch (err:any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'server error' });
  }
}
