"use client";

import { CAPTION_STYLES } from "@/lib/caption-generator";
import { cn } from "@/lib/cn";
import { LIMITS } from "@/lib/validation";
import type { CaptionStyle } from "@/types";
import type { RefObject } from "react";

export function CaptionGenerator({
  style,
  caption,
  edited,
  textareaRef,
  onStyle,
  onChange,
}: {
  style: CaptionStyle;
  caption: string;
  edited: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onStyle: (style: CaptionStyle) => void;
  onChange: (caption: string) => void;
}) {
  const over = caption.length > LIMITS.caption;

  return (
    <section className="rounded-[28px] border-2 border-lavender bg-white p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-xl font-extrabold text-ink">Caption</h2>
        <p className={`text-sm font-bold ${over ? "text-violet" : "text-muted"}`}>
          {caption.length}/{LIMITS.caption}
        </p>
      </div>
      <div role="radiogroup" aria-label="Caption style" className="mt-3 flex flex-wrap gap-2">
        {CAPTION_STYLES.map((item) => {
          const selected = item.id === style;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onStyle(item.id)}
              className={cn(
                "h-10 rounded-full px-3 text-sm font-extrabold",
                selected ? "bg-violet text-white" : "bg-mist text-ink",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {edited ? (
        <p className="mt-2 text-sm text-muted">Switching style replaces your edits.</p>
      ) : null}
      <label htmlFor="gem-caption" className="sr-only">
        Post caption
      </label>
      <textarea
        id="gem-caption"
        ref={textareaRef}
        data-testid="caption-text"
        value={caption}
        maxLength={LIMITS.captionHard}
        rows={8}
        onChange={(event) => onChange(event.target.value.slice(0, LIMITS.captionHard))}
        className="mt-3 w-full resize-y rounded-2xl border-2 border-lavender bg-mist px-4 py-3 text-base leading-6 text-ink outline-none focus-visible:border-violet"
      />
      {over ? (
        <p className="mt-2 text-sm font-semibold text-violet">
          X may cut this off after {LIMITS.caption} characters.
        </p>
      ) : (
        <p className="mt-2 text-sm leading-5 text-muted">
          Built only from what you wrote. Edit it before you post.
        </p>
      )}
    </section>
  );
}
