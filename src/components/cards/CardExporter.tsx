"use client";

import { useState, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { track } from "@/lib/analytics";
import { downloadDataUrl, exportCardPng, isIosDevice } from "@/lib/export-card";

export function CardExporter({
  targetRef,
  filename,
  background,
}: {
  targetRef: RefObject<HTMLDivElement | null>;
  filename: string;
  background: string;
}) {
  const push = useToast();
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function download() {
    const node = targetRef.current;
    if (!node || busy) return;
    setBusy(true);
    try {
      const result = await exportCardPng(node, background);
      downloadDataUrl(result.dataUrl, filename);
      track("card_downloaded", { fonts: result.fontsEmbedded });
      if (isIosDevice()) {
        setPreview(result.dataUrl);
      } else {
        push({
          message: result.fontsEmbedded
            ? "Card saved."
            : "Card saved. If the type looks plain, download it once more.",
        });
      }
    } catch (error) {
      console.error(error);
      push({
        tone: "err",
        message: "Couldn’t build the PNG. Wait a second and try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        full
        onClick={() => void download()}
        disabled={busy}
        aria-busy={busy}
        data-testid="download-card"
      >
        {busy ? "Preparing card…" : "Download my card"}
      </Button>
      {preview ? (
        <Modal title="Save your card" onClose={() => setPreview(null)}>
          <p>
            If the download didn’t land in Files, press and hold the image, then
            tap Add to Photos.
          </p>
          <img
            src={preview}
            alt="Your gem card, ready to save"
            className="mt-4 w-full rounded-2xl border-2 border-lavender"
          />
          <div className="mt-4">
            <Button type="button" full onClick={() => setPreview(null)}>
              Done
            </Button>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
