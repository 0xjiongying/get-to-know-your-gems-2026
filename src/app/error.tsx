"use client";

import { Button } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 py-16">
      <h1 className="font-display text-4xl font-extrabold uppercase leading-none text-ink">
        Something slipped.
      </h1>
      <p className="text-base leading-7 text-muted">
        Your answers are still in this tab. Try that step again.
      </p>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
