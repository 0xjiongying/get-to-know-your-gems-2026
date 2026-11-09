"use client";

import { CATEGORY_LABELS } from "@/types";
import { LIMITS } from "@/lib/validation";
import type { GemQuestion } from "@/types";

export function QuestionCard({
  question,
  index,
  total,
  value,
  error,
  onChange,
  onNext,
}: {
  question: GemQuestion;
  index: number;
  total: number;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  onNext: () => void;
}) {
  const number = String(index + 1).padStart(2, "0");
  const remaining = LIMITS.answer - value.length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-violet">
        Question {number} / {String(total).padStart(2, "0")}
      </p>
      <p className="w-fit rounded-full bg-blush px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-ink">
        {CATEGORY_LABELS[question.category]}
      </p>
      <h1 className="font-display text-[clamp(1.8rem,4.5vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
        {question.question}
      </h1>
      <div>
        <label htmlFor="gem-answer" className="sr-only">
          Your answer
        </label>
        <textarea
          id="gem-answer"
          data-testid="question-input"
          value={value}
          rows={3}
          maxLength={LIMITS.answer}
          placeholder="Type your answer..."
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "gem-answer-error" : "gem-answer-hint"}
          onChange={(event) =>
            onChange(event.target.value.replace(/[\r\n]+/g, " ").slice(0, LIMITS.answer))
          }
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              onNext();
            }
          }}
          className="min-h-28 w-full resize-none rounded-[24px] border-2 border-lavender bg-white px-4 py-4 text-lg leading-7 text-ink outline-none placeholder:text-muted focus-visible:border-violet"
        />
        <div className="mt-2 flex items-start justify-between gap-3">
          <p id="gem-answer-hint" className="text-sm leading-5 text-muted">
            Write it so a stranger gets it. These exact words go on your card. Enter to continue.
          </p>
          <p
            className={`shrink-0 text-sm font-bold ${remaining <= 8 ? "text-violet" : "text-muted"}`}
          >
            {value.length}/{LIMITS.answer}
          </p>
        </div>
        {error ? (
          <p id="gem-answer-error" role="alert" className="mt-2 text-sm font-semibold text-violet">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
