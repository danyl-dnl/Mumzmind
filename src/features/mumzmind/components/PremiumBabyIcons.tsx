import type { SVGProps } from "react";

export type PremiumBabyIconName =
  | "newborn"
  | "bottle"
  | "spoon"
  | "teddy"
  | "shoe"
  | "diaper"
  | "cereal"
  | "bib"
  | "chair"
  | "cup"
  | "playmat"
  | "safety"
  | "socks"
  | "stroller";

type PremiumBabyIconProps = {
  name: PremiumBabyIconName;
  className?: string;
};

function SvgBase({
  children,
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export function PremiumBabyIcon({ name, className }: PremiumBabyIconProps) {
  switch (name) {
    case "newborn":
      return (
        <img src="/images/premium_newborn.png" alt="newborn" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "bottle":
      return (
        <img src="/images/premium_bottle.png" alt="bottle" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "spoon":
      return (
        <img src="/images/premium_spoon.png" alt="spoon" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "teddy":
      return (
        <img src="/images/premium_teddy.png" alt="teddy" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "shoe":
      return (
        <img src="/images/premium_shoe.png" alt="shoe" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "diaper":
      return (
        <img src="/images/premium_diaper.png" alt="diaper" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "cereal":
      return (
        <img src="/images/premium_cereal.png" alt="cereal" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "bib":
      return (
        <img src="/images/premium_bib.png" alt="bib" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "chair":
      return (
        <img src="/images/premium_chair.png" alt="chair" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "cup":
      return (
        <img src="/images/premium_cup.png" alt="sippy cup" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "playmat":
      return (
        <img src="/images/premium_playmat.png" alt="playmat" className={className} style={{ objectFit: "cover", borderRadius: "10%" }} />
      );
    case "safety":
      return (
        <SvgBase className={className}>
          <path d="M32 11L47 17V29.8C47 39.1 40.8 47.2 32 50.2C23.2 47.2 17 39.1 17 29.8V17L32 11Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M26 31.5L30 35.5L38.5 26.5" stroke="#DE3A57" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M32 14.5V20" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
        </SvgBase>
      );
    case "socks":
      return (
        <SvgBase className={className}>
          <path d="M21 14H31V31C31 34.9 27.9 38 24 38H21V14Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M21 38H31V43.2C31 47.5 27.5 51 23.2 51H20C17.2 51 15 48.8 15 46C15 41.6 18.6 38 23 38H21Z" fill="#FFE9E4" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M33 18H43V35C43 38.9 39.9 42 36 42H33V18Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M33 42H43V47.2C43 51.5 39.5 55 35.2 55H32C29.2 55 27 52.8 27 50C27 45.6 30.6 42 35 42H33Z" fill="#FFE9E4" stroke="#A50D25" strokeWidth="2.2" transform="translate(0 -4)" />
        </SvgBase>
      );
    case "stroller":
      return (
        <SvgBase className={className}>
          <path d="M22 18L31 25.5" stroke="#A50D25" strokeWidth="3" strokeLinecap="round" />
          <path d="M31 25.5H44.5L39.5 40H24L20.5 30.5C19.7 28.3 21.3 25.9 23.7 25.9H31V25.5Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <circle cx="25" cy="45" r="4.5" fill="#F4B2B0" stroke="#A50D25" strokeWidth="2" />
          <circle cx="40" cy="45" r="4.5" fill="#F4B2B0" stroke="#A50D25" strokeWidth="2" />
          <path d="M24 30.5H39.5" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
        </SvgBase>
      );
    default:
      return null;
  }
}
