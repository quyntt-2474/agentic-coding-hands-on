import { LanguageSelector } from './language-selector';

export function LoginHeader() {
  return (
    <header className="flex items-center justify-between px-8 py-4 z-20 relative">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col leading-tight">
          <span className="text-white font-bold text-sm tracking-wide">Sun*</span>
          <span className="text-white/80 text-xs">Annual Awards 2025</span>
        </div>
      </div>

      {/* Language selector */}
      <LanguageSelector />
    </header>
  );
}
