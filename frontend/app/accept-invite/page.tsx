'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase';
import { Suspense } from 'react';

function AcceptInviteClient() {
  const params = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('Awaiting...');
  const router = useRouter();

  useEffect(() => {
    if (!token) { setStatus('No token'); return; }
    (async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setStatus('Please sign in first');
          return;
        }
        const idToken = await user.getIdToken();
        const res = await fetch('/api/account/accept-invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatus('Invite accepted — you now have access!');
          // Optionally redirect to dashboard
          setTimeout(() => router.push('/'), 1500);
        } else {
          setStatus(data.error || 'Failed to accept invite');
        }
      } catch (err: any) {
        setStatus(err.message || 'error');
      }
    })();
  }, [token, router]);

  return <div><h1>Accept invite</h1><p>{status}</p></div>;
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInviteClient />
    </Suspense>
  );
}