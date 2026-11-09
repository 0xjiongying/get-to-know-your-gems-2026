import { GemCard } from "@/components/cards/GemCard";
import { CardStage } from "@/components/cards/CardStage";
import { THEMES } from "@/data/themes";
import { GALLERY_SAMPLES } from "@/data/samples";

export function SampleCards() {
  return (
    <section className="border-t-2 border-[#E4D8FF] bg-white" aria-labelledby="gallery-heading">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-14 lg:py-20">
        <h2
          id="gallery-heading"
          className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em] text-ink"
        >
          Every gem is different.
        </h2>
        <p className="mt-3 max-w-lg text-base leading-7 text-muted">
          Create yours. Share yours. Discover other Gems.
        </p>
        <ul className="mt-8 grid gap-8 md:grid-cols-3 md:gap-5">
          {GALLERY_SAMPLES.map((sample, index) => (
            <li
              key={sample.id}
              className={index === 0 ? "md:-rotate-1" : index === 2 ? "md:rotate-1" : undefined}
            >
              <CardStage>
                <GemCard card={sample} />
              </CardStage>
              <p className="mt-3 text-center text-sm font-extrabold text-ink">
                {THEMES[sample.theme].name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
