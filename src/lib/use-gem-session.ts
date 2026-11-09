"use client";

import { useSyncExternalStore } from "react";
import { loadSession, subscribeSession } from "@/lib/storage";
import type { GemSession } from "@/types";

export function useIsClient(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useGemSession(): GemSession | null {
  return useSyncExternalStore(subscribeSession, loadSession, () => null);
}
