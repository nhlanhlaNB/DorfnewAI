// frontend/hooks/useAccount.ts
import { useEffect, useState } from 'react';
import { auth } from 'lib/firebase';

export function useAccount() {
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setAccount(null);
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch('/api/account/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        setAccount(null);
      } else {
        const data = await res.json();
        setAccount(data.account || null);
      }
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  return { account, loading, isPro: !!(account && account.planId === 'P-3CS59433TT1532629NBT25SQ') };
}
