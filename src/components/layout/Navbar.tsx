"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4">
      <Link href="/" aria-label="AlphaGems home" className="rounded-full">
        <Logo height={30} />
      </Link>
      {pathname === "/" ? (
        <Link
          href="/create"
          className="rounded-full px-3 py-2 text-sm font-extrabold text-violet"
        >
          Create my gem id
        </Link>
      ) : (
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-muted">
          Every gem has a story
        </p>
      )}
    </header>
  );
}
