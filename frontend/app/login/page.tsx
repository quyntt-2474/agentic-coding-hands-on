'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginHeader } from '@/components/login/login-header';
import { LoginHero } from '@/components/login/login-hero';
import { LoginFooter } from '@/components/login/login-footer';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1628] pb-10">
      <LoginHeader />
      <LoginHero />
      <LoginFooter />
    </div>
  );
}
