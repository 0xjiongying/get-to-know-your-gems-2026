import type { GemCard, GemProfile, GemSession, ThemeId } from "@/types";

const THEME_IDS: ThemeId[] = ["lavender", "pop", "crystal"];
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const AVATAR_SWATCHES = ["#DCCBFF", "#FFC9E8", "#E7DEFF", "#F7D5EC"];

export function createGemId(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let id = "GEM-";
  for (const byte of bytes) {
    id += ALPHABET[byte % ALPHABET.length];
  }
  return id;
}

export function createSeed(): number {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] ?? 1;
}

export function themeFromSeed(seed: number): ThemeId {
  return THEME_IDS[(seed >>> 0) % THEME_IDS.length] ?? "lavender";
}

export function initialFor(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "✦";
  return (Array.from(trimmed)[0] ?? "✦").toLocaleUpperCase();
}

export function avatarSwatch(name: string): string {
  let hash = 0;
  for (const char of name) {
    hash = (hash + char.charCodeAt(0)) % AVATAR_SWATCHES.length;
  }
  return AVATAR_SWATCHES[hash] ?? AVATAR_SWATCHES[0]!;
}

export function cardFilename(username: string, gemId: string): string {
  const handle = username.toLowerCase().replace(/[^a-z0-9_]/g, "") || "gem";
  return `alphagems-${handle}-${gemId.toLowerCase()}.png`;
}

export function buildGemCard(session: GemSession): GemCard {
  const profile: GemProfile = {
    displayName: session.profile.displayName.trim().replace(/\s+/g, " "),
    username: session.profile.username.replace(/@/g, "").replace(/\s+/g, ""),
    avatarUrl: session.profile.avatarUrl,
  };

  return {
    id: session.gemId,
    seed: session.seed,
    createdAt: session.createdAt,
    theme: session.theme,
    profile,
    answers: session.questions.map((question) => ({
      questionId: question.id,
      question: question.question,
      category: question.category,
      answer: (session.answers[question.id] ?? "").trim().replace(/\s+/g, " "),
    })),
  };
}
