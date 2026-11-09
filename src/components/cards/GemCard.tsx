"use client";

import { useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { THEMES } from "@/data/themes";
import { avatarSwatch, initialFor } from "@/lib/card-generator";
import { decorationVariant } from "@/lib/randomize";
import type { GemCard as GemCardModel } from "@/types";

const SANS = "var(--font-geist-sans), Geist, sans-serif";
const DISPLAY = "var(--font-nunito), Nunito, sans-serif";

function Heart({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={color}
        d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.65-7 9-7 9z"
      />
    </svg>
  );
}

function Star({ color }: { color: string }) {
  return (
    <svg width="42" height="42" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill={color}
        d="M12 2.4 14.7 8.6l6.6.6-5 4.3 1.5 6.4L12 16.8 6.2 19.9 7.7 13.5l-5-4.3 6.6-.6L12 2.4z"
      />
    </svg>
  );
}

function Spark({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true">
      <path fill={color} d="M12 2.2 20.2 12 12 21.8 3.8 12 12 2.2z" />
      <path fill="#FFFFFF" d="M12 2.2 20.2 12 12 12 3.8 12 12 2.2z" opacity="0.8" />
    </svg>
  );
}

function MiniDiamond({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4 L56 26 L32 60 L8 26 Z" fill={color} />
      <path d="M32 4 L56 26 L32 30 L8 26 Z" fill="#FFFFFF" opacity="0.85" />
    </svg>
  );
}

function Sticker({
  rotate,
  background,
  children,
}: {
  rotate: number;
  background: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 64,
        height: 64,
        borderRadius: 20,
        background,
        display: "grid",
        placeItems: "center",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 6px 0 rgba(36, 20, 61, 0.08)",
        flex: "0 0 auto",
      }}
    >
      {children}
    </div>
  );
}

export function GemCard({ card }: { card: GemCardModel }) {
  const theme = THEMES[card.theme];
  const variant = decorationVariant(card.seed);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const avatar =
    card.profile.avatarUrl && failedUrl !== card.profile.avatarUrl
      ? card.profile.avatarUrl
      : null;
  const initial = initialFor(card.profile.displayName || card.profile.username);

  const sticker =
    variant === 0 ? (
      <Heart color={theme.deep} />
    ) : variant === 1 ? (
      <Star color={theme.deep} />
    ) : (
      <Spark color={theme.deep} />
    );
  const stickerBg = variant === 1 ? theme.blush : "#FFFFFF";
  const rotate = variant === 0 ? -8 : variant === 1 ? 8 : -4;
  const showLeft = theme.id !== "crystal" && variant !== 1;
  const showRight = theme.id === "crystal" || variant !== 0;

  return (
    <article
      aria-label={`Gem card for @${card.profile.username}`}
      data-theme={theme.id}
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        background: theme.background,
        color: theme.ink,
        fontFamily: SANS,
        border: theme.id === "crystal" ? "12px solid #9666F5" : "0 solid transparent",
      }}
    >
      {theme.id === "lavender" ? <LavenderCorners /> : null}
      {theme.id === "pop" ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "#9666F5",
            top: -100,
            right: -70,
          }}
        />
      ) : null}
      {theme.sheet ? (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 26,
            borderRadius: 40,
            background: theme.sheet,
          }}
        />
      ) : null}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          padding: "44px 56px 36px",
        }}
      >
        <header style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Logo height={46} onDark={theme.logoOnDark} wordmark={theme.ink} />
        </header>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ width: 72, display: "grid", placeItems: "center" }}>
            {showLeft ? (
              <Sticker rotate={rotate} background={stickerBg}>
                {sticker}
              </Sticker>
            ) : null}
          </div>
          <div
            style={{
              width: 208,
              height: 208,
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: `0 0 0 8px ${theme.avatarRing}`,
              background: avatarSwatch(card.profile.displayName),
              display: "grid",
              placeItems: "center",
              flex: "0 0 auto",
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={`${card.profile.displayName} profile photo`}
                draggable={false}
                onError={() => setFailedUrl(card.profile.avatarUrl)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                role="img"
                aria-label={`${card.profile.displayName} avatar`}
                style={{
                  fontFamily: DISPLAY,
                  fontSize: 92,
                  fontWeight: 800,
                  color: "#5935A8",
                  lineHeight: 1,
                }}
              >
                {initial}
              </span>
            )}
          </div>
          <div style={{ width: 72, display: "grid", placeItems: "center" }}>
            {showRight ? (
              theme.id === "crystal" ? (
                <MiniDiamond color="#9666F5" />
              ) : (
                <Sticker rotate={rotate * -1} background={theme.accentSoft}>
                  {variant === 2 ? <Star color={theme.deep} /> : <Spark color={theme.deep} />}
                </Sticker>
              )
            ) : null}
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: "center", flexShrink: 0 }}>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 56,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: theme.ink,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            @{card.profile.username}
          </div>
          {card.profile.displayName ? (
            <div
              style={{
                marginTop: 6,
                fontSize: 28,
                fontWeight: 650,
                color: theme.muted,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {card.profile.displayName}
            </div>
          ) : null}
          <div
            style={{
              marginTop: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              background: theme.id === "crystal" ? "transparent" : theme.numberBg,
              color: theme.id === "crystal" ? theme.deep : theme.numberInk,
              border: theme.id === "crystal" ? "3px solid #5935A8" : "0 solid transparent",
              padding: "7px 16px",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.16em",
            }}
          >
            MY GEM ID
          </div>
        </div>

        <div style={{ marginTop: 26, flexShrink: 0 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.16em",
              color: theme.ink,
            }}
          >
            5 FACTS ABOUT ME
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {card.answers.slice(0, 5).map((answer, index) => (
            <div
              key={answer.questionId}
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                alignItems: "center",
                gap: 16,
                overflow: "hidden",
                borderRadius: 22,
                background: theme.factBg,
                padding: "10px 16px",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  flex: "0 0 auto",
                  borderRadius: 18,
                  display: "grid",
                  placeItems: "center",
                  background: theme.numberBg,
                  color: theme.numberInk,
                  border: `3px solid ${theme.numberBorder}`,
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: 24,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <p
                style={{
                  margin: 0,
                  minWidth: 0,
                  flex: 1,
                  color: theme.factInk,
                  fontSize: 36,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflowWrap: "anywhere",
                }}
              >
                {answer.answer}
              </p>
            </div>
          ))}
        </div>

        <footer
          style={{
            marginTop: 16,
            flexShrink: 0,
            borderTop: `2px dashed ${theme.footerRule}`,
            paddingTop: 14,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: "0.04em",
              color: theme.ink,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {card.id}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 650,
              color: theme.muted,
              textAlign: "right",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Every Gem Has a Story.
          </div>
        </footer>
      </div>
    </article>
  );
}

function LavenderCorners() {
  const spots = [
    { top: 8, left: 10 },
    { top: 8, right: 10 },
    { bottom: 8, left: 10 },
    { bottom: 8, right: 10 },
  ] as const;

  return (
    <>
      {spots.map((spot, index) => (
        <span
          key={index}
          aria-hidden="true"
          style={{ position: "absolute", ...spot }}
        >
          <MiniDiamond color={index % 2 === 0 ? "#9666F5" : "#FFFFFF"} />
        </span>
      ))}
    </>
  );
}
