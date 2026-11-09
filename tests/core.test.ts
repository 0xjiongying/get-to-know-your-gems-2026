import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { QUESTIONS } from "../src/data/questions.ts";
import { THEMES } from "../src/data/themes.ts";
import { canPublishPublicly } from "../src/lib/community.ts";
import {
  createGemId,
  themeFromSeed,
} from "../src/lib/card-generator.ts";
import {
  generateCaption,
  generateCaptions,
  xIntentUrl,
} from "../src/lib/caption-generator.ts";
import { mulberry32, selectQuestions } from "../src/lib/randomize.ts";
import {
  isCardReady,
  LIMITS,
  normalizeUsername,
  validateAnswer,
  validateDisplayName,
  validateImageFile,
  validateImageUrl,
  validateUsername,
} from "../src/lib/validation.ts";
import { CATEGORIES } from "../src/types/index.ts";
import type { GemAnswer, GemProfile } from "../src/types/index.ts";

const profile: GemProfile = {
  displayName: "Kiki",
  username: "kikigem",
  avatarUrl: null,
};

const answers: GemAnswer[] = [
  {
    questionId: "lifestyle-1",
    category: "lifestyle",
    question: "Coffee or matcha?",
    answer: "Matcha every morning",
  },
  {
    questionId: "lifestyle-3",
    category: "lifestyle",
    question: "Morning person or night owl?",
    answer: "Certified night owl",
  },
  {
    questionId: "web3-2",
    category: "web3",
    question: "Builder, researcher, or degen?",
    answer: "Builder, mostly",
  },
  {
    questionId: "fun-1",
    category: "fun",
    question: "If you were a gemstone, which one?",
    answer: "Amethyst",
  },
  {
    questionId: "community-5",
    category: "community",
    question: "Leave a message for the community.",
    answer: "Come say hi",
  },
];

describe("questions", () => {
  it("has a bank of at least 50 active unique questions across every category", () => {
    assert.ok(QUESTIONS.length >= 50);
    const ids = QUESTIONS.map((question) => question.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const category of CATEGORIES) {
      assert.ok(QUESTIONS.some((question) => question.category === category && question.isActive));
    }
  });
});

describe("selectQuestions", () => {
  it("picks five unique questions from different categories and stays stable for a seed", () => {
    const first = selectQuestions(QUESTIONS, 5, mulberry32(7));
    const second = selectQuestions(QUESTIONS, 5, mulberry32(7));
    const third = selectQuestions(QUESTIONS, 5, mulberry32(8));
    assert.equal(first.length, 5);
    assert.equal(new Set(first.map((question) => question.id)).size, 5);
    assert.equal(new Set(first.map((question) => question.category)).size, 5);
    assert.deepEqual(
      first.map((question) => question.id),
      second.map((question) => question.id),
    );
    assert.notDeepEqual(
      first.map((question) => question.id),
      third.map((question) => question.id),
    );
  });
});

describe("validation", () => {
  it("normalizes usernames and rejects bad ones", () => {
    assert.equal(normalizeUsername("  @@cool_name "), "cool_name");
    assert.equal(validateUsername("@kikigem"), null);
    assert.equal(normalizeUsername("no spaces"), "nospaces");
    assert.equal(validateUsername("cool.name"), "Use only letters, numbers, and underscores.");
    assert.ok(validateUsername("thisnameiswaytoolong"));
    assert.equal(validateDisplayName("  Kiki   Gem  "), null);
    assert.equal(validateDisplayName("   "), "Add the name you want on your card.");
    assert.equal(validateAnswer("   "), "Write a short answer to continue.");
    assert.equal(validateAnswer("a".repeat(LIMITS.answer)), null);
    assert.ok(validateAnswer("a".repeat(LIMITS.answer + 1)));
  });

  it("checks image files and https links", () => {
    assert.equal(validateImageFile({ type: "image/png", size: 100 }), null);
    assert.equal(validateImageFile({ type: "image/gif", size: 100 }), "Use a JPG, PNG, or WebP image.");
    assert.equal(validateImageUrl("https://example.com/a.png"), null);
    assert.equal(validateImageUrl("http://example.com/a.png"), "Use an https image link.");
  });

  it("requires a profile and five real answers before a card", () => {
    assert.equal(
      isCardReady({
        profile,
        questions: answers.map((answer) => ({ id: answer.questionId })),
        answers: Object.fromEntries(answers.map((answer) => [answer.questionId, answer.answer])),
      }),
      true,
    );
    assert.equal(
      isCardReady({
        profile,
        questions: answers.map((answer) => ({ id: answer.questionId })),
        answers: { "lifestyle-1": "Matcha" },
      }),
      false,
    );
  });
});

describe("captions", () => {
  it("uses the person's answers, stays within 280 characters, and does not invent facts", () => {
    const captions = generateCaptions(profile, answers, "GEM-KIKI7Q");
    for (const text of Object.values(captions)) {
      assert.ok(text.length <= 280);
      assert.match(text, /#AlphaGems/);
      assert.match(text, /Matcha every morning/);
      assert.equal(text.toLowerCase().includes("coffee enthusiast"), false);
    }
    const packed = generateCaption(
      "cute",
      { displayName: "A".repeat(24), username: "b".repeat(15), avatarUrl: null },
      answers.map((answer) => ({ ...answer, answer: "w".repeat(LIMITS.answer) })),
      "GEM-AAAAAA",
    );
    assert.ok(packed.length <= 280);
    assert.match(packed, /#AlphaGems/);
  });

  it("builds an X intent url without claiming an image attachment", () => {
    const url = new URL(xIntentUrl("hi gems"));
    assert.equal(url.origin, "https://x.com");
    assert.equal(url.pathname, "/intent/post");
    assert.equal(url.searchParams.get("text"), "hi gems");
    assert.equal(url.searchParams.get("url"), null);
  });
});

describe("gem identity", () => {
  it("creates readable gem ids and known themes", () => {
    const id = createGemId();
    assert.match(id, /^GEM-[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
    assert.equal(/[01IO]/.test(id), false);
    for (let seed = 0; seed < 12; seed += 1) {
      assert.ok(themeFromSeed(seed) in THEMES);
    }
  });
});

describe("community", () => {
  it("refuses public submissions until consent and moderation exist", () => {
    assert.equal(
      canPublishPublicly({ displayOnWall: true, consentedAt: "2026-01-01T00:00:00.000Z" }),
      false,
    );
    assert.equal(canPublishPublicly(null), false);
  });
});
