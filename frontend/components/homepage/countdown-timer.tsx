'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/lib/i18n';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
}

function DigitBox({ digit }: { digit: string }) {
  return (
    <div className="relative inline-flex items-center justify-center w-[51px] h-[82px] rounded-lg">
      <div
        className="absolute inset-0 rounded-lg opacity-50"
        style={{
          background: 'linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.10) 100%)',
          border: '0.5px solid #FFEA9E',
          backdropFilter: 'blur(16.64px)',
        }}
      />
      <span
        className="relative z-10 text-white leading-none tabular-nums"
        style={{ fontFamily: "var(--font-digital-numbers), monospace", fontSize: '49px', fontWeight: 400 }}
      >
        {digit}
      </span>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex gap-1">
        <DigitBox digit={padded[0]} />
        <DigitBox digit={padded[1]} />
      </div>
      <span className="text-[12px] font-bold font-[family-name:var(--font-montserrat)] text-white/60 tracking-[0.2em] uppercase">
        {label}
      </span>
    </div>
  );
}

function calcTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0 };
  const totalMinutes = Math.floor(diff / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  return {
    days: Math.floor(totalHours / 24),
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
  };
}

export function CountdownTimer() {
  const t = useTranslations();
  const envDate = process.env.NEXT_PUBLIC_EVENT_DATETIME;
  const targetDate = envDate ? new Date(envDate) : null;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    targetDate ? calcTimeLeft(targetDate) : { days: 0, hours: 0, minutes: 0 }
  );

  useEffect(() => {
    if (!targetDate) return;
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 60000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!targetDate) return null;

  const expired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0;
  if (expired) return null;

  return (
    <div className="flex items-start gap-3">
      <TimeUnit value={timeLeft.days} label={t.days} />
      <span className="text-[32px] font-bold text-white/50 mt-3 leading-none">:</span>
      <TimeUnit value={timeLeft.hours} label={t.hours} />
      <span className="text-[32px] font-bold text-white/50 mt-3 leading-none">:</span>
      <TimeUnit value={timeLeft.minutes} label={t.minutes} />
    </div>
  );
}
