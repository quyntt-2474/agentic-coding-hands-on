import Image from 'next/image';

interface AwardInfoCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  count: string;
  unit?: string;
  value: string;
  countLabel: string;
  valueLabel: string;
  perAward?: string;
  secondValue?: string;
  secondPerAward?: string;
  hoac?: string;
  /** When true, image renders on the right side (content on left) */
  reverse?: boolean;
}

function AwardImage({ imageUrl, title }: { imageUrl: string; title: string }) {
  return (
    <div className="shrink-0 mix-blend-screen size-[240px] md:size-[280px] xl:size-[336px] relative">
      <div
        className="size-full border border-[#FFEA9E] rounded-[20px] xl:rounded-[24px] overflow-hidden relative"
        style={{ boxShadow: '0px 4px 4px rgba(0,0,0,0.25), 0px 0px 6px #fae287' }}
      >
        {/* Award card background */}
        <Image src="/awards/award-card-bg.png" alt="" fill className="object-cover" sizes="336px" />
        {/* Award name badge */}
        <div className="absolute inset-0 flex items-center justify-center p-10 xl:p-14">
          <Image
            src={imageUrl}
            alt={title}
            width={220}
            height={90}
            className="object-contain w-auto h-auto max-w-[170px] xl:max-w-[221px] max-h-[80px] xl:max-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
}

export function AwardInfoCard({
  id,
  title,
  description,
  imageUrl,
  count,
  unit,
  value,
  countLabel,
  valueLabel,
  perAward,
  secondValue,
  secondPerAward,
  hoac,
  reverse = false,
}: AwardInfoCardProps) {
  const descParagraphs = description.split('\n\n');

  const contentBlock = (
    <div className="flex-1 flex flex-col gap-8 min-w-0 backdrop-blur-[32px]">
      {/* Title + description */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Image src="/icons/icon-target.svg" alt="" width={24} height={24} className="shrink-0" />
          <h3 className="text-[#FFEA9E] text-[20px] xl:text-[24px] font-bold font-[family-name:var(--font-montserrat)] leading-[32px] whitespace-nowrap">
            {title}
          </h3>
        </div>
        <div className="flex flex-col gap-4 max-w-[480px]">
          {descParagraphs.map((para, i) => (
            <p
              key={i}
              className="text-white text-[15px] xl:text-[16px] font-bold font-[family-name:var(--font-montserrat)] leading-[24px] text-justify tracking-[0.5px]"
            >
              {para}
            </p>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#2e3940]" />

      {/* Count section */}
      <div className="flex items-center gap-4 flex-wrap">
        <Image src="/icons/icon-diamond.svg" alt="" width={24} height={24} className="shrink-0" />
        <span className="text-[#FFEA9E] text-[20px] xl:text-[24px] font-bold font-[family-name:var(--font-montserrat)] leading-[32px] whitespace-nowrap">
          {countLabel}
        </span>
        <span className="text-white text-[32px] xl:text-[36px] font-bold font-[family-name:var(--font-montserrat)] leading-[44px]">
          {count}
        </span>
        {unit && (
          <span className="text-white text-[14px] font-bold font-[family-name:var(--font-montserrat)] w-[80px] leading-[20px]">
            {unit}
          </span>
        )}
      </div>

      <div className="h-px bg-[#2e3940]" />

      {/* Value section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Image src="/icons/icon-license.svg" alt="" width={24} height={24} className="shrink-0" />
          <span className="text-[#FFEA9E] text-[20px] xl:text-[24px] font-bold font-[family-name:var(--font-montserrat)] leading-[32px] whitespace-nowrap">
            {valueLabel}
          </span>
        </div>
        <span className="text-white text-[32px] xl:text-[36px] font-bold font-[family-name:var(--font-montserrat)] leading-[44px]">
          {value}
        </span>
        {perAward && (
          <span className="text-white text-[14px] font-bold font-[family-name:var(--font-montserrat)] tracking-[0.1px] max-w-[478px]">
            {perAward}
          </span>
        )}

        {/* Second value (Signature 2025) */}
        {secondValue && (
          <>
            <div className="flex items-center gap-2 w-full mt-2">
              <span className="text-[#2e3940] text-[14px] font-bold font-[family-name:var(--font-montserrat)] tracking-[0.1px] whitespace-nowrap">
                {hoac ?? 'Hoặc'}
              </span>
              <div className="flex-1 h-px bg-[#2e3940]" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Image src="/icons/icon-license.svg" alt="" width={24} height={24} className="shrink-0" />
                <span className="text-[#FFEA9E] text-[20px] xl:text-[24px] font-bold font-[family-name:var(--font-montserrat)] leading-[32px] whitespace-nowrap">
                  {valueLabel}
                </span>
              </div>
              <span className="text-white text-[32px] xl:text-[36px] font-bold font-[family-name:var(--font-montserrat)] leading-[44px]">
                {secondValue}
              </span>
              {secondPerAward && (
                <span className="text-white text-[14px] font-bold font-[family-name:var(--font-montserrat)] tracking-[0.1px] max-w-[478px]">
                  {secondPerAward}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      id={id}
      className={[
        'flex gap-8 xl:gap-10 items-start py-14 border-b border-[#2e3940] scroll-mt-[140px] md:scroll-mt-[100px]',
        'flex-col md:flex-row',
        reverse ? 'md:flex-row-reverse' : '',
      ].join(' ')}
    >
      <AwardImage imageUrl={imageUrl} title={title} />
      {contentBlock}
    </div>
  );
}
