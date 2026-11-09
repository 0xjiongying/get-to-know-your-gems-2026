import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldProps = {
  label: string;
  hint?: string;
  error?: string | null;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  id,
  className,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const generated = useId();
  const fieldId = id ?? generated;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldId} className="text-sm font-extrabold text-ink">
        {label}
      </label>
      <div
        className={cn(
          "flex h-14 items-center rounded-2xl border-2 bg-white px-4 transition-colors",
          error ? "border-violet" : "border-lavender focus-within:border-violet",
        )}
      >
        {prefix ? (
          <span className="pr-1 font-extrabold text-muted" aria-hidden="true">
            {prefix}
          </span>
        ) : null}
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hintId}
          className={cn(
            "h-full w-full bg-transparent text-base text-ink outline-none placeholder:text-muted",
            className,
          )}
          {...props}
        />
        {suffix}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm font-semibold text-violet">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm leading-5 text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
