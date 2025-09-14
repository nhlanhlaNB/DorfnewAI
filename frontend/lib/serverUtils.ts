// lib/serverUtils.ts
import type { NextApiRequest } from 'next';
import { authAdmin } from './firebaseAdmin';

export async function getUidFromReq(req: NextApiRequest) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) throw new Error('No auth token');
  const decoded = await authAdmin.verifyIdToken(token);
  return decoded.uid;
}
