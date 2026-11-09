import type { AnalyticsEvent, AnalyticsProps } from "@/types";

export function track(event: AnalyticsEvent, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  const detail = { event, props, at: new Date().toISOString() };
  const store = (window.__alphagemsEvents ??= []);
  store.push(detail);
  window.dispatchEvent(new CustomEvent("alphagems:analytics", { detail }));
}
