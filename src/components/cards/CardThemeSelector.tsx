"use client";

import { THEME_LIST } from "@/data/themes";
import { cn } from "@/lib/cn";
import type { ThemeId } from "@/types";

export function CardThemeSelector({
  value,
  onChange,
}: {
  value: ThemeId;
  onChange: (theme: ThemeId) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Card theme" className="grid grid-cols-3 gap-2">
      {THEME_LIST.map((theme) => {
        const selected = theme.id === value;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={selected}
            data-testid={`theme-${theme.id}`}
            onClick={() => onChange(theme.id)}
            className={cn(
              "rounded-2xl border-2 bg-white p-2 text-left transition-colors",
              selected ? "border-violet" : "border-lavender hover:border-brand",
            )}
          >
            <span
              aria-hidden="true"
              className="block h-10 w-full rounded-xl border border-white"
              style={{
                background:
                  theme.id === "lavender"
                    ? "linear-gradient(135deg, #DCCBFF, #FFFFFF 55%, #FFC9E8)"
                    : theme.id === "pop"
                      ? "linear-gradient(135deg, #5935A8, #9666F5 50%, #FFC9E8)"
                      : "linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(#9666F5, #9666F5) border-box",
                border: theme.id === "crystal" ? "3px solid #9666F5" : "0 solid transparent",
              }}
            />
            <span className="mt-2 block text-xs font-extrabold leading-4 text-ink">
              {theme.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
