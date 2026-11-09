import type { CaptionStyle, GemAnswer, GemProfile } from "@/types";

const CAPTION_LIMIT = 280;

const MARK: Record<GemAnswer["category"], string> = {
  about: "✶",
  personality: "💜",
  web3: "💎",
  lifestyle: "✿",
  fun: "★",
  dreams: "☾",
  community: "◈",
};

function factsOf(answers: GemAnswer[]): { mark: string; text: string }[] {
  return answers
    .map((answer) => ({
      mark: MARK[answer.category],
      text: answer.answer.replace(/\s+/g, " ").trim(),
    }))
    .filter((fact) => fact.text.length > 0);
}

function shorten(text: string, max: number): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, Math.max(1, max - 1)).trimEnd();
  const space = sliced.lastIndexOf(" ");
  const wordSafe = space > 8 ? sliced.slice(0, space) : sliced;
  return `${wordSafe.trimEnd()}…`;
}

function assemble(
  style: CaptionStyle,
  profile: GemProfile,
  gemId: string,
  facts: { mark: string; text: string }[],
): string {
  const name = profile.displayName.trim();
  const handle = profile.username.trim();
  const lines = facts.map((fact, index) => {
    if (style === "cool") return `${index + 1}. ${fact.text}`;
    if (style === "funny") return `• ${fact.text}`;
    return `${fact.mark} ${fact.text}`;
  });

  if (style === "cool") {
    return [
      `${name} · @${handle}`,
      "",
      ...lines,
      "",
      "every gem has a story.",
      `#AlphaGems · ${gemId}`,
    ].join("\n");
  }

  if (style === "funny") {
    return [
      `be honest. you don’t actually know @${handle}.`,
      "",
      ...lines,
      "",
      "your turn, gems. make a gem id.",
      `#AlphaGems · ${gemId}`,
    ].join("\n");
  }

  return [
    `hi gems, i’m ${name} (@${handle}) 💜`,
    "",
    ...lines,
    "",
    "every gem has a story.",
    "now it’s your turn. create your gem id!",
    `#AlphaGems · ${gemId}`,
  ].join("\n");
}

export function generateCaption(
  style: CaptionStyle,
  profile: GemProfile,
  answers: GemAnswer[],
  gemId: string,
): string {
  const facts = factsOf(answers);
  let limit = Math.max(...facts.map((fact) => fact.text.length), 0);
  let text = assemble(style, profile, gemId, facts);

  while (text.length > CAPTION_LIMIT && limit > 12) {
    limit -= 2;
    text = assemble(
      style,
      profile,
      gemId,
      facts.map((fact) => ({ ...fact, text: shorten(fact.text, limit) })),
    );
  }

  if (text.length > CAPTION_LIMIT) {
    const tag = "\n#AlphaGems";
    const head = text
      .slice(0, CAPTION_LIMIT - tag.length)
      .replace(/\n?#?AlphaGems\s*$/i, "")
      .trimEnd();
    text = `${head}${tag}`;
  }

  return text;
}

export function xIntentUrl(text: string): string {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}

export function generateCaptions(
  profile: GemProfile,
  answers: GemAnswer[],
  gemId: string,
): Record<CaptionStyle, string> {
  return {
    cute: generateCaption("cute", profile, answers, gemId),
    cool: generateCaption("cool", profile, answers, gemId),
    funny: generateCaption("funny", profile, answers, gemId),
  };
}

export const CAPTION_STYLES: { id: CaptionStyle; label: string }[] = [
  { id: "cute", label: "Cute & casual" },
  { id: "cool", label: "Cool & minimal" },
  { id: "funny", label: "Funny & playful" },
];
