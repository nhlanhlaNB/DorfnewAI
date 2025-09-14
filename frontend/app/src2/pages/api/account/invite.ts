// pages/api/account/invite.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestoreAdmin } from 'lib/firebaseAdmin';
import { getUidFromReq } from 'lib/serverUtils';
import admin from 'firebase-admin';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const inviterUid = await getUidFromReq(req);
    const { invitedEmail, accountId } = req.body;
    if (!invitedEmail || !accountId) return res.status(400).json({ error: 'invitedEmail and accountId required' });

    const accountSnap = await firestoreAdmin.collection('accounts').doc(accountId).get();
    if (!accountSnap.exists) return res.status(404).json({ error: 'account not found' });

    const account = accountSnap.data()!;
    if (account.ownerId !== inviterUid) return res.status(403).json({ error: 'only owner can invite' });

    // count existing members
    const membersSnap = await firestoreAdmin.collection('accounts').doc(accountId).collection('members').get();
    if (membersSnap.size >= (account.seatsTotal || 1)) {
      return res.status(400).json({ error: 'no seats available' });
    }

    // create token
    const token = crypto.randomBytes(24).toString('hex');
    const inviteDoc = {
      invitedEmail,
      accountId,
      inviterUid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 48 * 3600 * 1000)), // 48h
    };

    await firestoreAdmin.collection('invitations').doc(token).set(inviteDoc);

    // send email with link to accept (you must implement email sending, e.g., SendGrid or nodemailer)
    // sendEmail(invitedEmail, `Accept invite`, `Click: https://your-site.com/accept-invite?token=${token}`)

    res.status(200).json({ token });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'server error' });
  }
}
