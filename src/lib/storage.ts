import { QUESTIONS } from "@/data/questions";
import { createGemId, createSeed, themeFromSeed } from "@/lib/card-generator";
import { selectQuestions } from "@/lib/randomize";
import type {
  CaptionStyle,
  GemQuestion,
  GemSession,
  QuestionCategory,
  ThemeId,
} from "@/types";

const KEY = "alphagems.session.v1";
const EVENT = "alphagems:session";

let memoryRaw: string | null | undefined;
let memorySession: GemSession | null = null;

const THEMES = new Set<ThemeId>(["lavender", "pop", "crystal"]);
const STYLES = new Set<CaptionStyle>(["cute", "cool", "funny"]);
const CATEGORIES = new Set<QuestionCategory>([
  "about",
  "personality",
  "web3",
  "lifestyle",
  "fun",
  "dreams",
  "community",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isQuestion(value: unknown): value is GemQuestion {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.question === "string" &&
    typeof value.isActive === "boolean" &&
    typeof value.category === "string" &&
    CATEGORIES.has(value.category as QuestionCategory)
  );
}

function isSession(value: unknown): value is GemSession {
  if (!isRecord(value) || value.version !== 1) return false;
  if (typeof value.gemId !== "string" || typeof value.seed !== "number") return false;
  if (typeof value.createdAt !== "string") return false;
  if (typeof value.questionIndex !== "number") return false;
  if (!THEMES.has(value.theme as ThemeId)) return false;
  if (!STYLES.has(value.captionStyle as CaptionStyle)) return false;
  if (!isRecord(value.profile)) return false;
  if (typeof value.profile.displayName !== "string") return false;
  if (typeof value.profile.username !== "string") return false;
  if (typeof value.profile.avatarUrl !== "string" && value.profile.avatarUrl !== null) {
    return false;
  }
  if (!Array.isArray(value.questions) || !value.questions.every(isQuestion)) return false;
  if (!isRecord(value.answers)) return false;
  if (value.captionOverride !== null && typeof value.captionOverride !== "string") {
    return false;
  }
  if (!isRecord(value.tracked)) return false;
  return true;
}

export function loadSession(): GemSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (raw === memoryRaw) return memorySession;
  memoryRaw = raw;
  if (!raw) {
    memorySession = null;
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    memorySession = isSession(parsed) ? parsed : null;
  } catch {
    memorySession = null;
  }
  return memorySession;
}

export function saveSession(session: GemSession): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = JSON.stringify(session);
    sessionStorage.setItem(KEY, raw);
    memoryRaw = raw;
    memorySession = session;
    window.dispatchEvent(new Event(EVENT));
    return true;
  } catch {
    return false;
  }
}

export function subscribeSession(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}

export function createSession(): GemSession {
  const seed = createSeed();
  return {
    version: 1,
    gemId: createGemId(),
    seed,
    profile: { displayName: "", username: "", avatarUrl: null },
    questions: selectQuestions(QUESTIONS, 5),
    answers: {},
    questionIndex: 0,
    theme: themeFromSeed(seed),
    captionStyle: "cute",
    captionOverride: null,
    createdAt: new Date().toISOString(),
    tracked: {},
  };
}

export function reshuffleQuestions(session: GemSession): GemSession {
  const questions = selectQuestions(QUESTIONS, 5);
  const answers: Record<string, string> = {};
  for (const question of questions) {
    const previous = session.answers[question.id];
    if (previous) answers[question.id] = previous;
  }
  return {
    ...session,
    questions,
    answers,
    questionIndex: 0,
    captionOverride: null,
  };
}
