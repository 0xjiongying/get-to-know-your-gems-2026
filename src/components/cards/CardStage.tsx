"use client";

import { useLayoutEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { cn } from "@/lib/cn";

export function CardStage({
  children,
  cardRef,
  className,
}: {
  children: ReactNode;
  cardRef?: Ref<HTMLDivElement>;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.32);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const width = frame.clientWidth;
      if (width > 0) setScale(width / 1080);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className={cn("relative w-full overflow-clip", className)}
      style={{ height: Math.round(1350 * scale) }}
    >
      <div
        ref={cardRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1350,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
