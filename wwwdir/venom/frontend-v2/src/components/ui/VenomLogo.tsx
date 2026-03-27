import * as React from "react";

interface VenomLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showSlogan?: boolean;
  horizontal?: boolean;
}

export function VenomLogo({ size = "md", showSlogan = false, horizontal = true }: VenomLogoProps) {
  const sizes = {
    sm: { logo: 28, text: "text-lg", slogan: "text-[10px]" },
    md: { logo: 36, text: "text-xl", slogan: "text-xs" },
    lg: { logo: 48, text: "text-2xl", slogan: "text-sm" },
    xl: { logo: 64, text: "text-3xl", slogan: "text-base" },
  };

  const { logo: logoSize, text: textSize, slogan: sloganSize } = sizes[size];

  const LogoSVG = () => (
    <svg
      width={logoSize}
      height={logoSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="venomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        d="M50 5L90 25V75L50 95L10 75V25L50 5Z"
        fill="url(#venomGradient)"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
      />
      <path
        d="M50 15L80 30V70L50 85L20 70V30L50 15Z"
        fill="hsl(var(--background))"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fill="hsl(var(--primary))"
        fontSize="28"
        fontWeight="800"
        fontFamily="Sora, sans-serif"
      >
        V
      </text>
    </svg>
  );

  if (size === "xl" && !horizontal) {
    return (
      <div className="flex flex-col items-center gap-2">
        <LogoSVG />
        <span className={`font-display font-black ${textSize} text-foreground tracking-tight`}>
          VENOM <span className="text-primary">CODES</span>
        </span>
        {showSlogan && (
          <span className={`${sloganSize} text-muted-foreground/70 tracking-[0.2em] uppercase font-semibold`}>
            Stream • Control • Dominate
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${!horizontal ? "flex-col" : ""}`}>
      <LogoSVG />
      <div className="flex flex-col">
        <span className={`font-display font-black ${textSize} text-foreground tracking-tight leading-none`}>
          VENOM <span className="text-primary">CODES</span>
        </span>
        {showSlogan && (
          <span className={`${sloganSize} text-muted-foreground/70 tracking-[0.2em] uppercase font-semibold mt-0.5`}>
            Stream • Control • Dominate
          </span>
        )}
      </div>
    </div>
  );
}
