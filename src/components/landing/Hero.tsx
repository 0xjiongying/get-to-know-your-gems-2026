"use client";

import { useEffect } from "react";
import { GemCard } from "@/components/cards/GemCard";
import { CardStage } from "@/components/cards/CardStage";
import { Button } from "@/components/ui/Button";
import { DiamondMark } from "@/components/brand/Logo";
import { HERO_SAMPLE } from "@/data/samples";
import { track } from "@/lib/analytics";

export function Hero() {
  useEffect(() => {
    const key = "alphagems.landing-viewed";
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    track("landing_viewed");
  }, []);

  return (
    <section className="mx-auto grid w-full max-w-[1120px] items-center gap-10 px-5 pb-16 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,460px)] lg:gap-16 lg:pb-20 lg:pt-8">
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-violet shadow-[0_3px_0_#DCCBFF]">
          <DiamondMark size={16} />
          A little introduction
        </p>
        <h1 className="mt-5 font-display text-[clamp(3.3rem,8vw,6.4rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.05em] text-ink">
          <span className="block">Meet your</span>
          <span className="block">
            gem<span className="text-brand">.</span>
          </span>
        </h1>
        <p className="mt-5 max-w-md text-lg leading-8 text-ink">
          Five random questions. Five facts about you. One little card to show the world.
        </p>
        <div className="mt-7">
          <Button
            href="/create"
            data-testid="cta-create"
            onClick={() => track("create_started")}
          >
            Create my gem id
          </Button>
        </div>
        <p className="mt-4 text-sm font-semibold text-muted">
          A little introduction to the person behind the profile.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2 text-sm font-extrabold text-ink">
          <li className="rounded-full bg-white px-3 py-1.5">01 · Your name</li>
          <li className="rounded-full bg-white px-3 py-1.5">02 · Five facts</li>
          <li className="rounded-full bg-white px-3 py-1.5">03 · One card</li>
        </ul>
      </div>
      <div className="float-slow mx-auto w-full max-w-[460px]">
        <CardStage>
          <GemCard card={HERO_SAMPLE} />
        </CardStage>
      </div>
    </section>
  );
}
