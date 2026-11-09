import { cn } from "@/lib/cn";

const STEPS = [
  { id: "profile", label: "You" },
  { id: "questions", label: "Five facts" },
  { id: "card", label: "Your card" },
] as const;

export function FlowSteps({
  current,
}: {
  current: "profile" | "questions" | "card";
}) {
  const active = STEPS.findIndex((step) => step.id === current);

  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="Progress">
      {STEPS.map((step, index) => {
        const state = index < active ? "done" : index === active ? "current" : "upcoming";
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em]",
                state === "current" && "bg-violet text-white",
                state === "done" && "bg-lavender text-ink",
                state === "upcoming" && "bg-white text-muted",
              )}
            >
              <span className="sr-only">
                {state === "done" ? "Completed: " : state === "current" ? "Current: " : "Upcoming: "}
              </span>
              {step.label}
            </span>
            {index < STEPS.length - 1 ? (
              <span className="h-px w-4 bg-lavender" aria-hidden="true" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export function ProgressIndicator({
  current,
  total,
  onSelect,
}: {
  current: number;
  total: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Question progress">
      {Array.from({ length: total }, (_, index) => {
        const selected = index === current;
        return (
          <button
            key={index}
            type="button"
            aria-current={selected ? "step" : undefined}
            aria-label={`Question ${index + 1} of ${total}`}
            onClick={() => onSelect(index)}
            className="grid h-11 w-10 place-items-center"
          >
            <span
              className={cn(
                "block h-2.5 rounded-full",
                selected ? "w-8 bg-violet" : "w-2.5 bg-lavender",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
