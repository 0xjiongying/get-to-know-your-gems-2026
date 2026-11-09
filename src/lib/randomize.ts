import type { GemQuestion } from "@/types";

export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    const current = next[index]!;
    next[index] = next[swap]!;
    next[swap] = current;
  }
  return next;
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function selectQuestions(
  bank: readonly GemQuestion[],
  count = 5,
  rng: () => number = Math.random,
): GemQuestion[] {
  const active = bank.filter((question) => question.isActive);
  const categories = shuffle(
    [...new Set(active.map((question) => question.category))],
    rng,
  );
  const picked: GemQuestion[] = [];
  const used = new Set<string>();

  for (const category of categories) {
    if (picked.length >= count) break;
    const pool = active.filter(
      (question) => question.category === category && !used.has(question.id),
    );
    if (pool.length === 0) continue;
    const choice = pool[Math.floor(rng() * pool.length)];
    if (!choice) continue;
    picked.push(choice);
    used.add(choice.id);
  }

  if (picked.length < count) {
    const rest = shuffle(
      active.filter((question) => !used.has(question.id)),
      rng,
    );
    for (const question of rest) {
      if (picked.length >= count) break;
      picked.push(question);
      used.add(question.id);
    }
  }

  return shuffle(picked, rng);
}

export function decorationVariant(seed: number): 0 | 1 | 2 {
  const variant = (seed >>> 0) % 3;
  if (variant === 1) return 1;
  if (variant === 2) return 2;
  return 0;
}
