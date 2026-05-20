import Image from 'next/image';
import { LanguageSelector } from './language-selector';

export function LoginHeader() {
  return (
    <header
      className="absolute top-0 inset-x-0 flex items-center justify-between px-36 h-20 z-20"
      style={{ background: 'rgba(0, 0, 0, 0.45)' }}
    >
      <Image src="/saa-logo.png" alt="Sun* Annual Awards 2025" width={52} height={48} priority />
      <LanguageSelector />
    </header>
  );
}
