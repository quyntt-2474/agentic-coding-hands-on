'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const PUBLIC_PATHS = ['/login', '/countdown', '/auth/callback'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
    if (!isPublic && !localStorage.getItem('auth_token')) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  if (!checked) return null;
  return <>{children}</>;
}
