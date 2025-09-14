// pages/api/account/accept-invite.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestoreAdmin } from 'lib/firebaseAdmin';
import { getUidFromReq } from 'lib/serverUtils';
import admin from 'firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const uid = await getUidFromReq(req);
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'token required' });

    const inviteSnap = await firestoreAdmin.collection('invitations').doc(token).get();
    if (!inviteSnap.exists) return res.status(404).json({ error: 'invite not found' });

    const invite = inviteSnap.data()!;
    const now = admin.firestore.Timestamp.now();
    if (invite.expiresAt && invite.expiresAt.toMillis() < now.toMillis()) {
      return res.status(410).json({ error: 'invite expired' });
    }

    // add member to account
    const userRecord = await admin.auth().getUser(uid);
    // optional: check invitedEmail matches user's email
    if (invite.invitedEmail !== (userRecord.email || '')) {
      // Allow glue: if emails differ, you may still allow acceptance, or require email match.
      // For security, you may require match. Here we require it:
      return res.status(403).json({ error: 'This invite is for another email' });
    }

    // check seats again
    const accountRef = firestoreAdmin.collection('accounts').doc(invite.accountId);
    const accountSnap = await accountRef.get();
    const account = accountSnap.data()!;
    const membersSnap = await accountRef.collection('members').get();
    if (membersSnap.size >= (account.seatsTotal || 1)) {
      return res.status(400).json({ error: 'no seats available' });
    }

    await accountRef.collection('members').doc(uid).set({
      uid,
      email: userRecord.email || '',
      role: 'member',
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await firestoreAdmin.collection('users').doc(uid).set({
      email: userRecord.email || '',
      displayName: userRecord.displayName || '',
      accountId: invite.accountId,
      accountRole: 'member',
    }, { merge: true });

    // delete invite
    await firestoreAdmin.collection('invitations').doc(token).delete();

    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'server error' });
  }
}
