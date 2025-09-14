// pages/api/account/create.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { firestoreAdmin } from 'lib/firebaseAdmin';
import { getUidFromReq } from 'lib/serverUtils';
import admin from 'firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const uid = await getUidFromReq(req);
    const { planId, paypalSubscriptionId } = req.body;
    if (!planId) return res.status(400).json({ error: 'planId required' });

    // determine seats for the plan - you can map paypal planId to seats
    const seatsMap: Record<string, number> = {
      'P-3CS59433TT1532629NBT25SQ': 4, // Pro
      'P-4SW2058640943662UNBTJI6Y': 1, // Standard
    };
    const seatsTotal = seatsMap[planId] ?? 1;

    // Create account doc
    const accountRef = firestoreAdmin.collection('accounts').doc();
    const accountData = {
      ownerId: uid,
      planId,
      seatsTotal,
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      paypalSubscriptionId: paypalSubscriptionId || null,
    };
    await accountRef.set(accountData);

    // Add owner as a member (subcollection)
    const userRecord = await admin.auth().getUser(uid);
    await accountRef.collection('members').doc(uid).set({
      uid,
      email: userRecord.email || '',
      role: 'owner',
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update user doc
    await firestoreAdmin.collection('users').doc(uid).set({
      email: userRecord.email || '',
      displayName: userRecord.displayName || '',
      accountId: accountRef.id,
      accountRole: 'owner',
    }, { merge: true });

    res.status(200).json({ accountId: accountRef.id });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'server error' });
  }
}

