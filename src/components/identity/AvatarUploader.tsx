"use client";

import { useId, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { avatarFromFile, avatarFromUrl } from "@/lib/avatar";
import { avatarSwatch, initialFor } from "@/lib/card-generator";
import { cn } from "@/lib/cn";
import { buttonStyles } from "@/components/ui/Button";
import { validateImageUrl } from "@/lib/validation";

export function AvatarUploader({
  name,
  avatarUrl,
  onChange,
}: {
  name: string;
  avatarUrl: string | null;
  onChange: (avatarUrl: string | null) => void;
}) {
  const inputId = useId();
  const urlId = useId();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);

  async function applyFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await avatarFromFile(file));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not use that image.");
    } finally {
      setBusy(false);
    }
  }

  async function applyUrl() {
    const problem = validateImageUrl(url);
    if (problem) {
      setError(problem);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      onChange(await avatarFromUrl(url));
      setShowUrl(false);
      setUrl("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not use that link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-extrabold text-ink" id={`${inputId}-label`}>
        Profile picture
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div
          className={cn(
            "grid h-28 w-28 place-items-center overflow-hidden rounded-full border-4 border-white shadow-[0_0_0_3px_#DCCBFF]",
            dragging && "shadow-[0_0_0_3px_#5935A8]",
          )}
          style={{ background: avatarSwatch(name) }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void applyFile(event.dataTransfer.files[0]);
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${name || "Your"} profile preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-display text-4xl font-extrabold text-violet" aria-hidden="true">
              {name.trim() ? initialFor(name) : "✦"}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <label className={cn(buttonStyles({ variant: "secondary", size: "md" }), "cursor-pointer")}>
              <ImagePlus size={16} aria-hidden="true" />
              {avatarUrl ? "Change image" : "Upload image"}
              <input
                id={inputId}
                aria-labelledby={`${inputId}-label`}
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={busy}
                onChange={(event) => {
                  void applyFile(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
            {avatarUrl ? (
              <button
                type="button"
                className={buttonStyles({ variant: "ghost", size: "md" })}
                onClick={() => onChange(null)}
              >
                <Trash2 size={16} aria-hidden="true" />
                Remove image
              </button>
            ) : null}
          </div>
          <button
            type="button"
            className="self-start text-sm font-bold text-violet underline-offset-4 hover:underline"
            onClick={() => setShowUrl((open) => !open)}
            aria-expanded={showUrl}
          >
            {showUrl ? "Hide image link" : "Use an image link"}
          </button>
          <p className="text-sm leading-5 text-muted">
            JPG, PNG, or WebP. Up to 2 MB. We don’t pull your photo from X.
          </p>
        </div>
      </div>
      {showUrl ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={urlId}
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            type="url"
            inputMode="url"
            placeholder="https://"
            aria-label="Image link"
            className="h-12 flex-1 rounded-2xl border-2 border-lavender bg-white px-4 text-base text-ink outline-none focus-visible:border-violet"
          />
          <button
            type="button"
            className={buttonStyles({ variant: "secondary", size: "md" })}
            onClick={() => void applyUrl()}
            disabled={busy}
          >
            {busy ? "Reading…" : "Use this image"}
          </button>
        </div>
      ) : null}
      {busy ? <p className="text-sm font-semibold text-violet">Optimizing your photo…</p> : null}
      {error ? (
        <p role="alert" className="text-sm font-semibold text-violet">
          {error}
        </p>
      ) : null}
    </div>
  );
}
