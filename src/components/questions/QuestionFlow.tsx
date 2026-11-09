"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { ProgressIndicator } from "@/components/questions/ProgressIndicator";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { validateAnswer } from "@/lib/validation";
import type { GemQuestion } from "@/types";

export function QuestionFlow({
  questions,
  answers,
  index,
  onIndex,
  onAnswer,
  onShuffle,
  onBack,
  onAdvance,
  onComplete,
}: {
  questions: GemQuestion[];
  answers: Record<string, string>;
  index: number;
  onIndex: (index: number) => void;
  onAnswer: (questionId: string, value: string) => void;
  onShuffle: () => void;
  onBack: () => void;
  onAdvance: (question: GemQuestion) => void;
  onComplete: () => void;
}) {
  const reduce = useReducedMotion();
  const [error, setError] = useState<string | null>(null);
  const [confirmShuffle, setConfirmShuffle] = useState(false);
  const safeIndex = Math.min(Math.max(index, 0), Math.max(questions.length - 1, 0));
  const question = questions[safeIndex];
  const hasAnswers = Object.values(answers).some((answer) => answer.trim().length > 0);

  if (!question) return null;

  const value = answers[question.id] ?? "";
  const last = safeIndex === questions.length - 1;

  function goNext() {
    const problem = validateAnswer(value);
    if (problem) {
      setError(value.trim() ? problem : "Write an answer, or skip for now.");
      return;
    }
    setError(null);
    onAdvance(question);
    if (last) {
      const missing = questions.findIndex(
        (item) => validateAnswer(answers[item.id] ?? "") !== null,
      );
      if (missing >= 0) {
        onIndex(missing);
        setError("This one still needs an answer before the card.");
        return;
      }
      onComplete();
      return;
    }
    onIndex(safeIndex + 1);
  }

  function skip() {
    setError(null);
    if (last) {
      const missing = questions.findIndex((item) => {
        const current = item.id === question.id ? value : (answers[item.id] ?? "");
        return validateAnswer(current) !== null;
      });
      if (missing >= 0) {
        onIndex(missing);
        setError("Answer the skipped ones so your card has all five facts.");
        return;
      }
      onComplete();
      return;
    }
    onIndex(safeIndex + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProgressIndicator
          current={safeIndex}
          total={questions.length}
          onSelect={(next) => {
            setError(null);
            onIndex(next);
          }}
        />
        <button
          type="button"
          data-testid="shuffle-questions"
          className="inline-flex h-11 items-center gap-2 rounded-full px-2 text-sm font-bold text-violet"
          onClick={() => {
            if (hasAnswers) setConfirmShuffle(true);
            else onShuffle();
          }}
        >
          <RefreshCw size={16} aria-hidden="true" />
          Shuffle questions
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
        >
          <QuestionCard
            question={question}
            index={safeIndex}
            total={questions.length}
            value={value}
            error={error}
            onChange={(next) => {
              setError(null);
              onAnswer(question.id, next);
            }}
            onNext={goNext}
          />
        </motion.div>
      </AnimatePresence>

      <p className="text-sm text-muted">
        Skip just moves ahead. You’ll need all five answers before the card.
      </p>

      <div className="sticky bottom-0 -mx-5 grid grid-cols-[auto_1fr] gap-2 border-t-2 border-lavender bg-mist px-5 py-3 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0">
        <Button type="button" variant="ghost" onClick={onBack}>
          Back
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="secondary" size="md" full onClick={skip} data-testid="question-skip">
            Skip
          </Button>
          <Button type="button" size="md" full onClick={goNext} data-testid="question-next">
            {last ? "Make my card" : "Next question"}
          </Button>
        </div>
      </div>

      {confirmShuffle ? (
        <Modal title="Shuffle your five questions?" onClose={() => setConfirmShuffle(false)}>
          <p>
            You’ll get a new mix. Anything you already answered stays only if that
            question comes back.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button type="button" variant="secondary" onClick={() => setConfirmShuffle(false)}>
              Keep these
            </Button>
            <Button
              type="button"
              onClick={() => {
                setConfirmShuffle(false);
                setError(null);
                onShuffle();
              }}
            >
              Shuffle
            </Button>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
