"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ProfileForm } from "@/components/identity/ProfileForm";
import { FlowSteps } from "@/components/questions/ProgressIndicator";
import { QuestionFlow } from "@/components/questions/QuestionFlow";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { track } from "@/lib/analytics";
import { createSession, loadSession, reshuffleQuestions, saveSession } from "@/lib/storage";
import { useGemSession, useIsClient } from "@/lib/use-gem-session";
import { isProfileValid } from "@/lib/validation";
import type { GemProfile, GemQuestion, GemSession } from "@/types";

const EMPTY_PROFILE: GemProfile = {
  displayName: "",
  username: "",
  avatarUrl: null,
};

export function CreateFlow() {
  const router = useRouter();
  const pathname = usePathname();
  const push = useToast();
  const client = useIsClient();
  const stored = useGemSession();
  const [draft, setDraft] = useState<GemSession | null>(null);
  const session = draft ?? stored;
  const step = pathname.endsWith("/questions") ? "questions" : "profile";

  function persist(update: (current: GemSession) => GemSession): GemSession | null {
    const next = update(loadSession() ?? createSession());
    setDraft(next);
    if (!saveSession(next)) {
      push({
        tone: "err",
        message: "This browser blocked saving. Try a smaller photo.",
      });
      return null;
    }
    return next;
  }

  if (!client) {
    return (
      <div className="mx-auto w-full max-w-xl px-5 py-16" aria-hidden="true">
        <div className="h-8 w-40 rounded-full bg-lavender" />
        <div className="mt-6 h-16 w-3/4 rounded-3xl bg-white" />
        <div className="mt-4 h-28 rounded-[28px] bg-white" />
      </div>
    );
  }

  if (step === "questions" && (!session || !isProfileValid(session.profile))) {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-5 py-16">
        <h1 className="font-display text-4xl font-extrabold uppercase leading-none text-ink">
          First, the basics.
        </h1>
        <p className="text-base leading-7 text-muted">
          Add your name before the questions.
        </p>
        <Button href="/create">Add my name</Button>
      </div>
    );
  }

  function continueProfile(profile: GemProfile) {
    const already = (loadSession() ?? session)?.tracked.profile;
    const saved = persist((current) => ({
      ...current,
      profile,
      tracked: { ...current.tracked, profile: true },
    }));
    if (!saved) return;
    if (!already) track("profile_completed");
    router.push("/create/questions");
  }

  function recordAnswer(question: GemQuestion) {
    const current = loadSession();
    const answered = current?.tracked.answered ?? [];
    if (!current || answered.includes(question.id)) return;
    track("question_answered", {
      questionId: question.id,
      category: question.category,
    });
    persist((latest) => ({
      ...latest,
      tracked: {
        ...latest.tracked,
        answered: [...(latest.tracked.answered ?? []), question.id],
      },
    }));
  }

  function finish() {
    const current = loadSession();
    if (!current?.tracked.questions) track("questions_completed");
    if (!current?.tracked.card) track("card_generated", { theme: current?.theme ?? "lavender" });
    const saved = persist((latest) => ({
      ...latest,
      captionOverride: null,
      tracked: { ...latest.tracked, questions: true, card: true },
    }));
    if (!saved) return;
    router.push("/result");
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-5 pb-8 pt-2">
      <FlowSteps current={step} />
      {step === "profile" || !session ? (
        <ProfileForm
          profile={session?.profile ?? EMPTY_PROFILE}
          onChange={(profile) => persist((current) => ({ ...current, profile }))}
          onSubmit={continueProfile}
        />
      ) : (
        <QuestionFlow
          questions={session.questions}
          answers={session.answers}
          index={session.questionIndex}
          onIndex={(questionIndex) =>
            persist((current) => ({ ...current, questionIndex }))
          }
          onAnswer={(questionId, value) =>
            persist((current) => ({
              ...current,
              answers: { ...current.answers, [questionId]: value },
            }))
          }
          onShuffle={() => persist((current) => reshuffleQuestions(current))}
          onBack={() => router.push("/create")}
          onAdvance={recordAnswer}
          onComplete={finish}
        />
      )}
    </div>
  );
}
