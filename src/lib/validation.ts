import type { GemProfile } from "@/types";

export const LIMITS = {
  displayName: 24,
  username: 15,
  answer: 54,
  caption: 280,
  captionHard: 500,
  avatarBytes: 2 * 1024 * 1024,
} as const;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const USERNAME = /^[A-Za-z0-9_]+$/;

export function normalizeUsername(input: string): string {
  return input.replace(/@/g, "").replace(/\s+/g, "");
}

export function cleanDisplayName(input: string): string {
  return input.trim().replace(/\s+/g, " ");
}

export function cleanAnswer(input: string): string {
  return input.replace(/[\r\n]+/g, " ").replace(/[ \t]{2,}/g, " ");
}

export function validateDisplayName(input: string): string | null {
  const name = cleanDisplayName(input);
  if (!name) return "Add the name you want on your card.";
  if (name.length > LIMITS.displayName) {
    return `Keep your display name to ${LIMITS.displayName} characters.`;
  }
  if (/[\u0000-\u001F]/.test(name)) {
    return "That name contains characters we can’t use.";
  }
  return null;
}

export function validateUsername(input: string): string | null {
  const username = normalizeUsername(input);
  if (!username) return "Add your X username.";
  if (username.length > LIMITS.username) {
    return "X usernames are 15 characters or fewer.";
  }
  if (!USERNAME.test(username)) {
    return "Use only letters, numbers, and underscores.";
  }
  return null;
}

export function validateAnswer(input: string): string | null {
  const answer = input.trim();
  if (!answer) return "Write a short answer to continue.";
  if (answer.length > LIMITS.answer) {
    return `Keep it to ${LIMITS.answer} characters so it fits the card.`;
  }
  return null;
}

export function validateImageFile(file: {
  type: string;
  size: number;
}): string | null {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return "Use a JPG, PNG, or WebP image.";
  }
  if (file.size <= 0) return "That file looks empty.";
  if (file.size > LIMITS.avatarBytes) {
    return "That image is over 2 MB. Try a smaller one.";
  }
  return null;
}

export function validateImageUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return "Paste an image link.";
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return "That link doesn’t look right.";
  }
  if (url.protocol !== "https:") return "Use an https image link.";
  if (url.username || url.password) return "That link doesn’t look right.";
  return null;
}

export function isProfileValid(profile: GemProfile): boolean {
  return (
    validateDisplayName(profile.displayName) === null &&
    validateUsername(profile.username) === null
  );
}

export function isCardReady(input: {
  profile: GemProfile;
  questions: { id: string }[];
  answers: Record<string, string>;
}): boolean {
  if (!isProfileValid(input.profile)) return false;
  if (input.questions.length !== 5) return false;
  return input.questions.every(
    (question) => validateAnswer(input.answers[question.id] ?? "") === null,
  );
}
