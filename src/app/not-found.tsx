import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-5 py-16">
      <h1 className="font-display text-4xl font-extrabold uppercase leading-none text-ink">
        This page wandered off.
      </h1>
      <p className="text-base leading-7 text-muted">
        The gem you’re looking for isn’t here.
      </p>
      <Button href="/">Back home</Button>
    </div>
  );
}
