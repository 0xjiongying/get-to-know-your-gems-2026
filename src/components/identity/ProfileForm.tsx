"use client";

import { useState, type FormEvent } from "react";
import { AvatarUploader } from "@/components/identity/AvatarUploader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  cleanDisplayName,
  LIMITS,
  normalizeUsername,
  validateDisplayName,
  validateUsername,
} from "@/lib/validation";
import type { GemProfile } from "@/types";

export function ProfileForm({
  profile,
  onChange,
  onSubmit,
}: {
  profile: GemProfile;
  onChange: (profile: GemProfile) => void;
  onSubmit: (profile: GemProfile) => void;
}) {
  const [errors, setErrors] = useState<{ name?: string; username?: string }>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: GemProfile = {
      displayName: cleanDisplayName(profile.displayName),
      username: normalizeUsername(profile.username),
      avatarUrl: profile.avatarUrl,
    };
    const nameError = validateDisplayName(next.displayName);
    const usernameError = validateUsername(next.username);
    setErrors({
      name: nameError ?? undefined,
      username: usernameError ?? undefined,
    });
    if (nameError || usernameError) return;
    onChange(next);
    onSubmit(next);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div>
        <h1 className="font-display text-[clamp(2.4rem,6vw,3.4rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink uppercase">
          Who’s this gem?
        </h1>
        <p className="mt-3 max-w-md text-base leading-7 text-muted">
          A name, an @, and a face. That’s enough to start.
        </p>
      </div>
      <Input
        label="Display name"
        name="displayName"
        autoComplete="nickname"
        placeholder="What should we call you?"
        maxLength={LIMITS.displayName}
        value={profile.displayName}
        error={errors.name}
        hint={`${profile.displayName.length}/${LIMITS.displayName}`}
        onChange={(event) => {
          setErrors((current) => ({ ...current, name: undefined }));
          onChange({ ...profile, displayName: event.target.value });
        }}
      />
      <Input
        label="X username"
        name="username"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        placeholder="yourusername"
        prefix="@"
        maxLength={LIMITS.username}
        value={profile.username}
        error={errors.username}
        hint="Letters, numbers, and underscores. We don’t fetch your X photo."
        onChange={(event) => {
          setErrors((current) => ({ ...current, username: undefined }));
          onChange({
            ...profile,
            username: normalizeUsername(event.target.value).slice(0, 30),
          });
        }}
      />
      <AvatarUploader
        name={profile.displayName}
        avatarUrl={profile.avatarUrl}
        onChange={(avatarUrl) => onChange({ ...profile, avatarUrl })}
      />
      <div className="sticky bottom-0 -mx-5 mt-2 border-t-2 border-lavender bg-mist px-5 py-3 md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0">
        <Button type="submit" full data-testid="profile-submit">
          Let’s get to know you
        </Button>
      </div>
    </form>
  );
}
