'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLang } from './language-context';

const TRANSLATIONS = {
  VN: {
    subtitle: 'Bắt đầu hành trình của bạn cùng SAA 2025.',
    cta: 'Đăng nhập để khám phá!',
    loginBtn: 'ĐĂNG NHẬP với Google',
  },
  EN: {
    subtitle: 'Begin your journey with SAA 2025.',
    cta: 'Log in to explore!',
    loginBtn: 'LOGIN With Google',
  },
} as const;

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3000';

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

const MONTSERRAT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 700,
  fontSize: '20px',
  lineHeight: '40px',
  letterSpacing: '0.5px',
};

export function LoginHero() {
  const [loading, setLoading] = useState(false);
  const { lang } = useLang();
  const t = TRANSLATIONS[lang];

  function handleLogin() {
    setLoading(true);
    window.location.href = `${BACKEND_URL}/auth/google`;
  }

  return (
    <main className="h-screen relative flex items-center overflow-hidden">
      {/* Key visual — artwork background image from Figma */}
      <Image
        src="/key-visual.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        className="object-cover"
      />
      {/* Left gradient overlay — Figma "Rectangle 57" */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0, 16, 26, 0.00) 100%)' }}
        aria-hidden="true"
      />
      {/* Cover overlay — bottom dark gradient matching Figma spec */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(0deg, #00101A 22.48%, rgba(0, 19, 32, 0.00) 51.74%)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 px-16 py-20 max-w-xl">
        {/* ROOT FURTHER logo — branded image asset from Figma */}
        <div className="mb-6">
          <Image
            src="/root-further-logo.png"
            alt="ROOT FURTHER"
            width={451}
            height={200}
            priority
            className="max-w-full h-auto"
          />
        </div>

        <p className="text-white/90 mb-1 whitespace-nowrap" style={MONTSERRAT_STYLE}>
          {t.subtitle}
        </p>
        <p className="text-white/80 mb-8" style={MONTSERRAT_STYLE}>
          {t.cta}
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`
            flex items-center gap-3 px-8 py-3 rounded-full font-semibold text-sm tracking-wide
            bg-[#f0e0b0] text-[#1a1a1a]
            transition-all duration-200
            ${loading
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:shadow-[0_8px_24px_rgba(240,224,176,0.35)] hover:-translate-y-0.5 cursor-pointer'}
          `}
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4 text-[#1a1a1a]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <GoogleIcon />
          )}
          {t.loginBtn}
        </button>
      </div>
    </main>
  );
}
