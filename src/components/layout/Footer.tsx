import { DiamondMark } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 px-5 py-8 text-sm text-muted">
      <p className="inline-flex items-center gap-2 font-bold text-ink">
        <DiamondMark size={18} />
        AlphaGems
      </p>
      <p>Every gem has a story.</p>
    </footer>
  );
}
