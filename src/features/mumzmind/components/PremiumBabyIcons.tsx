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
        <SvgBase className={className}>
          <circle cx="32" cy="31" r="18" fill="#FFE9E4" />
          <path d="M23 45.5C25.6 40.8 29 38.5 32 38.5C35 38.5 38.4 40.8 41 45.5" fill="#F4B2B0" />
          <path d="M22 24C22 17.8 26.8 13 32 13C37.2 13 42 17.8 42 24V29.4C42 35 37.5 39.5 32 39.5C26.5 39.5 22 35 22 29.4V24Z" fill="#FFF8F5" />
          <path d="M27 16.5C28.7 13.6 31.6 12 34.7 12C39.9 12 44 16 44 21.1C44 23.3 43.3 25 42.2 26.3C40.8 21.7 36.8 18.5 31.8 18.5C29.7 18.5 27.7 19.1 26 20.2C26 18.9 26.3 17.7 27 16.5Z" fill="#DE3A57" fillOpacity="0.22" />
          <path d="M29 20.3C29.7 17.3 32.1 15 35.3 15C37.5 15 39.2 16.2 40 18" stroke="#A50D25" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="27.5" cy="28.5" r="1.8" fill="#250000" />
          <circle cx="36.5" cy="28.5" r="1.8" fill="#250000" />
          <path d="M28.4 33.4C30.8 35.5 33.2 35.5 35.6 33.4" stroke="#A50D25" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="32" cy="35.5" r="4.6" fill="#F4B2B0" />
          <circle cx="30.2" cy="35.5" r="2.4" fill="#FFF8F5" />
          <circle cx="33.8" cy="35.5" r="2.4" fill="#FFF8F5" />
        </SvgBase>
      );
    case "bottle":
      return (
        <SvgBase className={className}>
          <path d="M25 13.5H39V20L43.5 25.5V43C43.5 48.2 39.2 52.5 34 52.5H30C24.8 52.5 20.5 48.2 20.5 43V25.5L25 20V13.5Z" fill="#FFF8F5" />
          <path d="M25 13.5H39V20L43.5 25.5V43C43.5 48.2 39.2 52.5 34 52.5H30C24.8 52.5 20.5 48.2 20.5 43V25.5L25 20V13.5Z" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M27.5 11H36.5C38.4 11 40 12.6 40 14.5V17H24V14.5C24 12.6 25.6 11 27.5 11Z" fill="#DE3A57" fillOpacity="0.22" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M23.4 27H40.6" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M23.4 32.5H37" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M23.4 38H40.6" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M23.4 43.5H37" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M30 20.5H34C36.2 20.5 38 22.3 38 24.5V48H26V24.5C26 22.3 27.8 20.5 30 20.5Z" fill="#FDF1F0" />
        </SvgBase>
      );
    case "spoon":
      return (
        <SvgBase className={className}>
          <ellipse cx="23.5" cy="23" rx="8.5" ry="10.5" fill="#FFE9E4" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M29.5 29.5L47 47" stroke="#A50D25" strokeWidth="5.2" strokeLinecap="round" />
          <path d="M43 43L50 50" stroke="#DE3A57" strokeWidth="5.2" strokeLinecap="round" />
          <path d="M19 20C20.8 18 22.7 17 24.6 17C27.1 17 29.2 18.4 30.4 20.5" stroke="#FFF8F5" strokeWidth="2.2" strokeLinecap="round" />
        </SvgBase>
      );
    case "teddy":
      return (
        <SvgBase className={className}>
          <circle cx="20" cy="20" r="8" fill="#F4B2B0" />
          <circle cx="44" cy="20" r="8" fill="#F4B2B0" />
          <circle cx="32" cy="31" r="17" fill="#FFE9E4" />
          <circle cx="32" cy="31" r="17" stroke="#A50D25" strokeWidth="2.2" />
          <circle cx="25.5" cy="29.5" r="1.8" fill="#250000" />
          <circle cx="38.5" cy="29.5" r="1.8" fill="#250000" />
          <ellipse cx="32" cy="36.2" rx="5.8" ry="4.6" fill="#FFF8F5" stroke="#A50D25" strokeWidth="1.8" />
          <path d="M29.5 37.4C31.1 39 32.9 39 34.5 37.4" stroke="#A50D25" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="32" cy="34.8" r="1.7" fill="#A50D25" />
        </SvgBase>
      );
    case "shoe":
      return (
        <SvgBase className={className}>
          <path d="M14 38C16.3 34 20.2 31.5 25 31.5H33.3C35.2 31.5 36.8 32.3 38.1 33.9L43.4 40.4L52 42.5V46C52 49 49.6 51.5 46.6 51.5H22.4C17.2 51.5 13 47.3 13 42.1V40.8C13 39.8 13.4 38.8 14 38Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M19 41.5H34.5" stroke="#DE3A57" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M25.5 31.7L29.2 38.5" stroke="#A50D25" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M31 31.7L34.7 38.5" stroke="#A50D25" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M17.2 46.5H48.8" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
        </SvgBase>
      );
    case "diaper":
      return (
        <SvgBase className={className}>
          <path d="M17 20L26 16H38L47 20L44.5 46C44.2 49.5 41.3 52 37.8 52H26.2C22.7 52 19.8 49.5 19.5 46L17 20Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M17.8 25.5C21.1 25.5 23.9 28 24.3 31.3L25 36.2C25.4 39.4 28.1 41.8 31.4 41.8H32.6C35.9 41.8 38.6 39.4 39 36.2L39.7 31.3C40.1 28 42.9 25.5 46.2 25.5" stroke="#F4B2B0" strokeWidth="2.2" />
          <path d="M22 17.8L24.7 23" stroke="#DE3A57" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M42 17.8L39.3 23" stroke="#DE3A57" strokeWidth="2.2" strokeLinecap="round" />
        </SvgBase>
      );
    case "cereal":
      return (
        <SvgBase className={className}>
          <path d="M17 34C17 26.8 22.8 21 30 21H48C48 35.8 40.5 46 30.8 46H28.2C21.9 46 17 40.1 17 34Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M20.5 28.5H43.5" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="27" cy="31.5" r="2.3" fill="#DE3A57" fillOpacity="0.35" />
          <circle cx="32.6" cy="34.5" r="2.3" fill="#DE3A57" fillOpacity="0.35" />
          <circle cx="38.2" cy="31" r="2.3" fill="#DE3A57" fillOpacity="0.35" />
          <path d="M46 17L52 11" stroke="#A50D25" strokeWidth="3.2" strokeLinecap="round" />
          <ellipse cx="43.4" cy="19.4" rx="4.6" ry="3.4" transform="rotate(-42 43.4 19.4)" fill="#FFE9E4" stroke="#A50D25" strokeWidth="2" />
        </SvgBase>
      );
    case "bib":
      return (
        <SvgBase className={className}>
          <path d="M22 17.5C22 12.8 25.8 9 30.5 9H33.5C38.2 9 42 12.8 42 17.5V23.3L46.5 31.7C47.8 34.1 46.1 37 43.4 37H40V46.3C40 49.4 37.4 52 34.3 52H29.7C26.6 52 24 49.4 24 46.3V37H20.6C17.9 37 16.2 34.1 17.5 31.7L22 23.3V17.5Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <circle cx="32" cy="26" r="5" fill="#F4B2B0" fillOpacity="0.75" />
          <path d="M27.8 14.5C28.5 13 29.9 12 31.5 12H32.5C34.1 12 35.5 13 36.2 14.5" stroke="#DE3A57" strokeWidth="2.2" strokeLinecap="round" />
        </SvgBase>
      );
    case "chair":
      return (
        <SvgBase className={className}>
          <path d="M22 17H42V29C42 33.4 38.4 37 34 37H30C25.6 37 22 33.4 22 29V17Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M25 37V48.5" stroke="#A50D25" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M39 37V48.5" stroke="#A50D25" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M22 24H42" stroke="#F4B2B0" strokeWidth="2.2" />
          <path d="M20 49H44" stroke="#A50D25" strokeWidth="2.6" strokeLinecap="round" />
        </SvgBase>
      );
    case "cup":
      return (
        <SvgBase className={className}>
          <path d="M22 18H42V42C42 47.5 37.5 52 32 52C26.5 52 22 47.5 22 42V18Z" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M26 14.5L22 18" stroke="#A50D25" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M38 14.5L42 18" stroke="#A50D25" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M27 26H37" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M27 32H37" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M27 38H35" stroke="#F4B2B0" strokeWidth="2.2" strokeLinecap="round" />
        </SvgBase>
      );
    case "playmat":
      return (
        <SvgBase className={className}>
          <rect x="12" y="20" width="18" height="18" rx="5" fill="#FFE9E4" stroke="#A50D25" strokeWidth="2.2" />
          <rect x="34" y="20" width="18" height="18" rx="5" fill="#FFF8F5" stroke="#A50D25" strokeWidth="2.2" />
          <rect x="23" y="30" width="18" height="18" rx="5" fill="#F4B2B0" stroke="#A50D25" strokeWidth="2.2" />
          <path d="M23 39H41" stroke="#DE3A57" strokeWidth="2.2" strokeLinecap="round" />
        </SvgBase>
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
