"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { GemCard } from "@/components/cards/GemCard";
import { CardStage } from "@/components/cards/CardStage";
import { CardThemeSelector } from "@/components/cards/CardThemeSelector";
import { CardExporter } from "@/components/cards/CardExporter";
import { Button } from "@/components/ui/Button";
import { CaptionGenerator } from "@/components/sharing/CaptionGenerator";
import { ShareActions } from "@/components/sharing/ShareActions";
import { useToast } from "@/components/ui/Toast";
import { THEMES } from "@/data/themes";
import { QUESTIONS } from "@/data/questions";
import { track } from "@/lib/analytics";
import {
  buildGemCard,
  cardFilename,
  createGemId,
  createSeed,
  themeFromSeed,
} from "@/lib/card-generator";
import { generateCaptions } from "@/lib/caption-generator";
import { selectQuestions } from "@/lib/randomize";
import { loadSession, saveSession } from "@/lib/storage";
import { useGemSession, useIsClient } from "@/lib/use-gem-session";
import { isCardReady, isProfileValid } from "@/lib/validation";
import type { CaptionStyle, GemSession, ThemeId } from "@/types";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      const copied = document.execCommand("copy");
      area.remove();
      return copied;
    } catch {
      return false;
    }
  }
}

export function ResultExperience() {
  const router = useRouter();
  const push = useToast();
  const reduce = useReducedMotion();
  const client = useIsClient();
  const stored = useGemSession();
  const [draft, setDraft] = useState<GemSession | null>(null);
  const session = draft ?? stored;
  const cardRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);

  const card = useMemo(
    () => (session && isCardReady(session) ? buildGemCard(session) : null),
    [session],
  );
  const captions = useMemo(
    () => (card ? generateCaptions(card.profile, card.answers, card.id) : null),
    [card],
  );

  function persist(update: (current: GemSession) => GemSession) {
    const current = loadSession() ?? session;
    if (!current) return;
    const next = update(current);
    setDraft(next);
    saveSession(next);
  }

  if (!client) {
    return (
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16" aria-hidden="true">
        <div className="mx-auto h-[420px] max-w-sm rounded-[32px] bg-white" />
      </div>
    );
  }

  if (!session || !card || !captions) {
    const continueHref =
      session && isProfileValid(session.profile) ? "/create/questions" : "/create";
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 py-16">
        <h1 className="font-display text-4xl font-extrabold uppercase leading-none text-ink">
          No gem in this tab yet.
        </h1>
        <p className="text-base leading-7 text-muted">
          Your card stays in this browser tab until you finish the five facts.
        </p>
        <Button href={continueHref}>
          {session ? "Continue my gem id" : "Create my gem id"}
        </Button>
      </div>
    );
  }

  const caption = session.captionOverride ?? captions[session.captionStyle];

  async function copyCaption() {
    const ok = await copyText(caption);
    if (ok) {
      track("caption_copied", { style: session!.captionStyle });
      push({ message: "Caption copied." });
      return;
    }
    captionRef.current?.focus();
    captionRef.current?.select();
    push({
      tone: "err",
      message: "Couldn’t copy. Select the caption and copy it manually.",
    });
  }

  function setTheme(theme: ThemeId) {
    persist((current) => ({ ...current, theme }));
  }

  function setStyle(captionStyle: CaptionStyle) {
    persist((current) => ({ ...current, captionStyle, captionOverride: null }));
  }

  function createAnother() {
    if (!session) return;
    track("create_another_clicked");
    const seed = createSeed();
    const next: GemSession = {
      ...session,
      gemId: createGemId(),
      seed,
      theme: themeFromSeed(seed),
      questions: selectQuestions(QUESTIONS, 5),
      answers: {},
      questionIndex: 0,
      captionStyle: "cute",
      captionOverride: null,
      createdAt: new Date().toISOString(),
      tracked: {},
    };
    setDraft(next);
    saveSession(next);
    router.push("/create/questions");
  }

  return (
    <motion.div
      className="mx-auto grid w-full max-w-[1120px] gap-8 px-5 pb-16 pt-2 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-start lg:gap-x-14"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <header className="lg:col-start-2">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet">
          {card.id}
        </p>
        <h1 className="mt-2 font-display text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-ink">
          Your gem id is ready!
        </h1>
        <p className="mt-3 max-w-md text-lg leading-7 text-muted">
          A little piece of you, made for the internet.
        </p>
      </header>

      <div className="lg:col-start-1 lg:row-span-3 lg:row-start-1">
        <CardStage cardRef={cardRef}>
          <GemCard card={card} />
        </CardStage>
        <div className="mt-4">
          <CardThemeSelector value={session.theme} onChange={setTheme} />
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:col-start-2">
        <div className="flex flex-col gap-3">
          <CardExporter
            targetRef={cardRef}
            filename={cardFilename(card.profile.username, card.id)}
            background={THEMES[card.theme].background}
          />
          <ShareActions caption={caption} onCopy={() => void copyCaption()} />
        </div>
        <CaptionGenerator
          style={session.captionStyle}
          caption={caption}
          edited={session.captionOverride !== null}
          textareaRef={captionRef}
          onStyle={setStyle}
          onChange={(value) =>
            persist((current) => ({ ...current, captionOverride: value }))
          }
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button href="/create/questions" variant="ghost" data-testid="edit-answers">
            Edit my answers
          </Button>
          <Button
            type="button"
            variant="ghost"
            data-testid="create-another"
            onClick={createAnother}
          >
            Create another gem id
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
