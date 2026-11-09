import type { ThemeId } from "@/types";

export interface ThemeTokens {
  id: ThemeId;
  name: string;
  description: string;
  background: string;
  sheet: string | null;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
  blush: string;
  deep: string;
  factBg: string;
  factInk: string;
  numberBg: string;
  numberInk: string;
  numberBorder: string;
  footerRule: string;
  avatarRing: string;
  logoOnDark: boolean;
}

export const THEMES: Record<ThemeId, ThemeTokens> = {
  lavender: {
    id: "lavender",
    name: "Lavender Dream",
    description: "Soft, friendly, a little dreamy.",
    background: "#DCCBFF",
    sheet: "#FFFFFF",
    ink: "#24143D",
    muted: "#6B6284",
    accent: "#9666F5",
    accentSoft: "#F5F0FF",
    blush: "#FFC9E8",
    deep: "#5935A8",
    factBg: "#F5F0FF",
    factInk: "#24143D",
    numberBg: "#5935A8",
    numberInk: "#FFFFFF",
    numberBorder: "#5935A8",
    footerRule: "#DCCBFF",
    avatarRing: "#FFFFFF",
    logoOnDark: false,
  },
  pop: {
    id: "pop",
    name: "Purple Pop",
    description: "Bold purple, pink stickers, more energy.",
    background: "#5935A8",
    sheet: null,
    ink: "#FFFFFF",
    muted: "#F3EAFF",
    accent: "#FFC9E8",
    accentSoft: "#DCCBFF",
    blush: "#FFC9E8",
    deep: "#3E2180",
    factBg: "#FFFFFF",
    factInk: "#24143D",
    numberBg: "#FFC9E8",
    numberInk: "#5935A8",
    numberBorder: "#FFC9E8",
    footerRule: "rgba(255, 255, 255, 0.45)",
    avatarRing: "#FFFFFF",
    logoOnDark: true,
  },
  crystal: {
    id: "crystal",
    name: "Clean Crystal",
    description: "White space, purple border, editorial.",
    background: "#FFFFFF",
    sheet: null,
    ink: "#24143D",
    muted: "#6B6284",
    accent: "#9666F5",
    accentSoft: "#F5F0FF",
    blush: "#FFC9E8",
    deep: "#5935A8",
    factBg: "#F5F0FF",
    factInk: "#24143D",
    numberBg: "#FFFFFF",
    numberInk: "#5935A8",
    numberBorder: "#5935A8",
    footerRule: "#DCCBFF",
    avatarRing: "#F5F0FF",
    logoOnDark: false,
  },
};

export const THEME_LIST: ThemeTokens[] = [
  THEMES.lavender,
  THEMES.pop,
  THEMES.crystal,
];
