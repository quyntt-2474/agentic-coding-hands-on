'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from '@/lib/i18n';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
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

function DigitBox({ digit }: { digit: string }) {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: 77, height: 123 }}
    >
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: 'linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.10) 100%)',
          border: '0.75px solid #FFEA9E',
          borderRadius: 12,
          backdropFilter: 'blur(25px)',
        }}
      />
      <span
        className="relative z-10 text-white leading-none tabular-nums"
        style={{ fontFamily: 'var(--font-digital-numbers), monospace', fontSize: 74, fontWeight: 400 }}
      >
        {digit}
      </span>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-start" style={{ gap: 21 }}>
      <div className="flex" style={{ gap: 21 }}>
        <DigitBox digit={padded[0]} />
        <DigitBox digit={padded[1]} />
      </div>
      <span
        className="font-bold text-white"
        style={{ fontFamily: 'var(--font-montserrat)', fontSize: 36, lineHeight: '48px' }}
      >
        {label}
      </span>
    </div>
  );
}

export function PrelaunchPage() {
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
  }, [targetDate]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#00101A' }}
    >
      <Image
        src="/key-visual.png"
        alt=""
        fill
        priority
        className="object-cover"
        style={{ objectPosition: 'right center' }}
        sizes="100vw"
      />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(18deg, #00101A 15.48%, rgba(0, 18, 29, 0.46) 52.13%, rgba(0, 19, 32, 0.00) 63.41%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center" style={{ gap: 24 }}>
        <p
          className="text-white font-bold text-center"
          style={{ fontFamily: 'var(--font-montserrat)', fontSize: 36, lineHeight: '48px' }}
        >
          {t.countdownTitle}
        </p>
        <div className="flex items-start" style={{ gap: 60 }}>
          <TimeUnit value={timeLeft.days} label={t.days} />
          <TimeUnit value={timeLeft.hours} label={t.hours} />
          <TimeUnit value={timeLeft.minutes} label={t.minutes} />
        </div>
      </div>
    </div>
  );
}
