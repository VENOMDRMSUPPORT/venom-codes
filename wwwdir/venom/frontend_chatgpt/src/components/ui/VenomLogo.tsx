import React, { useId } from "react";
import { motion } from "framer-motion";

type LogoSize = "sm" | "md" | "lg" | "xl";

interface VenomLogoProps {
  size?: LogoSize;
  showSlogan?: boolean;
  horizontal?: boolean;
  className?: string;
}

const sizeMap = {
  sm: {
    iconSize: 28,
    venom: "text-[17px]",
    codes: "text-[17px]",
    slogan: "text-[8px]",
    gap: "gap-2.5",
    dividerH: "h-5",
    wordGap: "gap-[3px]",
    sloganMt: "mt-[2px]",
  },
  md: {
    iconSize: 38,
    venom: "text-[22px]",
    codes: "text-[22px]",
    slogan: "text-[9px]",
    gap: "gap-3",
    dividerH: "h-7",
    wordGap: "gap-[4px]",
    sloganMt: "mt-[3px]",
  },
  lg: {
    iconSize: 52,
    venom: "text-[28px]",
    codes: "text-[28px]",
    slogan: "text-[10px]",
    gap: "gap-3.5",
    dividerH: "h-9",
    wordGap: "gap-[5px]",
    sloganMt: "mt-[3px]",
  },
  xl: {
    iconSize: 72,
    venom: "text-[44px]",
    codes: "text-[44px]",
    slogan: "text-[12px]",
    gap: "gap-5",
    dividerH: "h-14",
    wordGap: "gap-[6px]",
    sloganMt: "mt-1",
  },
};

export function VenomLogo({ size = "md", showSlogan = false, horizontal = true, className = "" }: VenomLogoProps) {
  const s = sizeMap[size];

  if (horizontal) {
    return (
      <div className={`flex items-center ${s.gap} ${className}`}>
        <LogoMark size={s.iconSize} variant="inline" />
        <div className={`${s.dividerH} w-px bg-gradient-to-b from-transparent via-primary/25 to-transparent`} />
        <div className="flex flex-col leading-none">
          <BrandText venomClass={s.venom} codesClass={s.codes} wordGap={s.wordGap} variant="inline" />
          {showSlogan && <SloganText className={s.slogan} mt={s.sloganMt} />}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <LogoMark size={s.iconSize} variant="hero" />
      <div className="mt-5 flex flex-col items-center leading-none">
        <BrandText venomClass={s.venom} codesClass={s.codes} wordGap={s.wordGap} variant="hero" />
        {showSlogan && <SloganText className={s.slogan} mt="mt-2.5" center variant="hero" />}
      </div>
    </div>
  );
}

function LogoMarkSVG({ size }: { size: number }) {
  const uid = useId().replace(/:/g, "");
  const markGradId = `vMark-${uid}`;
  const shieldGradId = `vShield-${uid}`;
  const shieldStrokeId = `vStroke-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="VENOM CODES"
    >
      <defs>
        <linearGradient id={shieldGradId} x1="100" y1="16" x2="100" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.12" />
          <stop offset="60%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id={shieldStrokeId} x1="100" y1="16" x2="100" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={markGradId} x1="100" y1="44" x2="100" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      <path
        d="M100 16 L172 48 L172 116 C172 154 142 180 100 188 C58 180 28 154 28 116 L28 48 Z"
        fill={`url(#${shieldGradId})`}
        stroke={`url(#${shieldStrokeId})`}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M72 56 L100 152 L128 56"
        stroke={`url(#${markGradId})`}
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      <path
        d="M72 56 L58 78"
        stroke="hsl(var(--primary))"
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      <path
        d="M128 56 L142 78"
        stroke="hsl(var(--primary))"
        strokeWidth="4"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />

      <circle cx="100" cy="44" r="3" fill="hsl(var(--primary))" fillOpacity="0.65" />
    </svg>
  );
}

type LogoVariant = "hero" | "inline";

function LogoMark({ size, variant }: { size: number; variant: LogoVariant }) {
  if (variant === "hero") {
    return (
      <motion.div
        className="relative flex-shrink-0"
        initial={{ opacity: 0, scale: 0.9, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="absolute inset-[-40%] rounded-full bg-primary/[0.06] dark:bg-primary/[0.12] blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <LogoMarkSVG size={size} />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative flex-shrink-0">
      <LogoMarkSVG size={size} />
    </div>
  );
}

function BrandText({
  venomClass,
  codesClass,
  wordGap,
  variant,
}: {
  venomClass: string;
  codesClass: string;
  wordGap: string;
  variant: LogoVariant;
}) {
  if (variant === "hero") {
    return (
      <div className={`flex items-baseline ${wordGap} font-display font-black tracking-[-0.02em]`}>
        <motion.span
          className={`${venomClass} text-foreground`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          VENOM
        </motion.span>
        <motion.span
          className={`${codesClass} text-primary`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
        >
          CODES
        </motion.span>
      </div>
    );
  }

  return (
    <div className={`flex items-baseline ${wordGap} font-display font-black tracking-[-0.02em]`}>
      <span className={`${venomClass} text-foreground`}>VENOM</span>
      <span className={`${codesClass} text-primary`}>CODES</span>
    </div>
  );
}

function SloganText({
  className,
  mt,
  center,
  variant,
}: {
  className: string;
  mt: string;
  center?: boolean;
  variant?: LogoVariant;
}) {
  const base = `${className} ${mt} font-medium tracking-[0.22em] uppercase text-muted-foreground/70 ${center ? "text-center" : ""}`;

  if (variant === "hero") {
    return (
      <motion.p
        className={base}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Stream · Control · Dominate
      </motion.p>
    );
  }

  return <p className={base}>Stream · Control · Dominate</p>;
}
