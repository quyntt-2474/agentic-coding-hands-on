'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginHeader } from '@/components/login/login-header';
import { LoginHero } from '@/components/login/login-hero';
import { LoginFooter } from '@/components/login/login-footer';
import { LanguageProvider } from '@/components/login/language-context';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      router.replace('/');
    }
  }, [router]);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-[#00101A]">
        <LoginHeader />
        <LoginHero />
        <LoginFooter />
      </div>
    </LanguageProvider>
  );
}
