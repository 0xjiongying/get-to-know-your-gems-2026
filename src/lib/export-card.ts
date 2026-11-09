import { toPng } from "html-to-image";

const COLOR_FUNCTION = /oklch\([^)]*\)|oklab\([^)]*\)|lch\([^)]*\)|lab\([^)]*\)|color\([^)]*\)/gi;

function normalizeColors(value: string): string {
  if (!value || !/oklch|oklab|\blch\(|\blab\(|\bcolor\(/i.test(value)) return value;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return value;

  return value.replace(COLOR_FUNCTION, (match) => {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = "#010203";
    try {
      context.fillStyle = match;
    } catch {
      return match;
    }
    if (context.fillStyle === "#010203") return match;
    context.fillRect(0, 0, 1, 1);
    const pixel = context.getImageData(0, 0, 1, 1).data;
    const red = pixel[0] ?? 0;
    const green = pixel[1] ?? 0;
    const blue = pixel[2] ?? 0;
    const alpha = Math.round(((pixel[3] ?? 255) / 255) * 1000) / 1000;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  });
}

function withSafeColors<T>(run: () => Promise<T>): Promise<T> {
  const native = window.getComputedStyle.bind(window);
  window.getComputedStyle = ((element: Element, pseudo?: string | null) => {
    const style = native(element, pseudo ?? undefined);
    return new Proxy(style, {
      get(target, prop) {
        if (prop === "cssText") return normalizeColors(target.cssText);
        if (prop === "getPropertyValue") {
          return (name: string) => normalizeColors(target.getPropertyValue(name));
        }
        const value = Reflect.get(target, prop, target);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
  }) as typeof window.getComputedStyle;

  return run().finally(() => {
    window.getComputedStyle = native;
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read the card image."));
    image.src = src;
  });
}

async function waitForImages(node: HTMLElement): Promise<void> {
  const images = [...node.querySelectorAll("img")];
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }
          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
}

async function capture(node: HTMLElement, backgroundColor: string, skipFonts: boolean) {
  await document.fonts.ready;
  await waitForImages(node);
  return withSafeColors(() =>
    toPng(node, {
      cacheBust: true,
      pixelRatio: 1,
      skipAutoScale: true,
      skipFonts,
      preferredFontFormat: "woff2",
      backgroundColor,
      width: 1080,
      height: 1350,
      canvasWidth: 1080,
      canvasHeight: 1350,
      style: {
        transform: "none",
        transformOrigin: "top left",
        width: "1080px",
        height: "1350px",
      },
    }),
  );
}

export async function exportCardPng(
  node: HTMLElement,
  backgroundColor: string,
): Promise<{ dataUrl: string; fontsEmbedded: boolean }> {
  let fontsEmbedded = true;
  let dataUrl: string;
  try {
    dataUrl = await capture(node, backgroundColor, false);
  } catch {
    fontsEmbedded = false;
    dataUrl = await capture(node, backgroundColor, true);
  }

  if (!dataUrl.startsWith("data:image/png")) {
    throw new Error("Could not build the card image.");
  }

  const image = await loadImage(dataUrl);
  if (image.width !== 1080 || image.height !== 1350) {
    throw new Error("Could not build the card image.");
  }

  return { dataUrl, fontsEmbedded };
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const agent = navigator.userAgent;
  if (/iPad|iPhone|iPod/i.test(agent)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
