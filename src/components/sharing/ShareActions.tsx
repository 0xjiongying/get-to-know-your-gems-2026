"use client";

import { buttonStyles } from "@/components/ui/Button";
import { xIntentUrl } from "@/lib/caption-generator";
import { track } from "@/lib/analytics";

function XMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.7 10.3 22.4 1.5h-1.8l-6.7 7.6L8.3 1.5H1.6l8.1 11.5L1.6 22.5h1.8l7.1-8.1 5.7 8.1h6.7l-8.2-12.2Zm-2.5 2.8-.8-1.2L4.1 2.9h2.8l5.3 7.4.8 1.2 6.9 9.7h-2.8l-5.9-8.1Z"
      />
    </svg>
  );
}

export function ShareActions({
  caption,
  onCopy,
}: {
  caption: string;
  onCopy: () => void;
}) {
  const href = xIntentUrl(caption);

  return (
    <div className="flex flex-col gap-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="share-x"
        className={buttonStyles({ variant: "secondary", full: true })}
        onClick={() => track("x_share_clicked")}
      >
        <XMark />
        Share on X
      </a>
      <button
        type="button"
        data-testid="copy-caption"
        className={buttonStyles({ variant: "blush", full: true })}
        onClick={onCopy}
      >
        Copy caption
      </button>
      <p className="text-sm leading-5 text-muted">
        X opens a post with your caption. Download the card and attach it
        yourself — this link can’t add the image for you.
      </p>
    </div>
  );
}
