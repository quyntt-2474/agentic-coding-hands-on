'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type LangCode = 'VN' | 'EN';

const LanguageContext = createContext<{
  lang: LangCode;
  setLang: (lang: LangCode) => void;
}>({ lang: 'VN', setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('VN');

  useEffect(() => {
    const stored = localStorage.getItem('lang') as LangCode | null;
    if (stored === 'VN' || stored === 'EN') setLangState(stored);
  }, []);

  function setLang(code: LangCode) {
    setLangState(code);
    localStorage.setItem('lang', code);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
