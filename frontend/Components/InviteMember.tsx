'use client';
import { useState } from 'react';
import { auth } from '../lib/firebase'; // your firebase client
import { getIdToken } from 'firebase/auth';

export default function InviteMember({ accountId }: { accountId: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  async function invite() {
    setStatus('Sending...');
    const token = await auth.currentUser!.getIdToken();
    const res = await fetch('/api/account/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ invitedEmail: email, accountId }),
    });
    const data = await res.json();
    if (res.ok) setStatus('Invite sent!');
    else setStatus(data.error || 'Error');
  }

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Invite email" />
      <button onClick={invite}>Invite</button>
      <p>{status}</p>
    </div>
  );
}
