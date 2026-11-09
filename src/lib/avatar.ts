import { LIMITS, validateImageFile, validateImageUrl } from "@/lib/validation";

const MAX_EDGE = 512;

function readBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read that image."));
    };
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(blob);
  });
}

function downscale(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const largest = Math.max(image.width, image.height);
      if (!largest) {
        reject(new Error("Could not read that image."));
        return;
      }
      const scale = Math.min(1, MAX_EDGE / largest);
      const width = Math.max(1, Math.round(image.width * scale));
      const height = Math.max(1, Math.round(image.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Could not read that image."));
        return;
      }
      context.fillStyle = "#F5F0FF";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.86));
    };
    image.onerror = () => reject(new Error("Could not read that image."));
    image.src = src;
  });
}

export async function avatarFromFile(file: File): Promise<string> {
  const problem = validateImageFile(file);
  if (problem) throw new Error(problem);
  const dataUrl = await readBlob(file);
  return downscale(dataUrl);
}

export async function avatarFromUrl(input: string): Promise<string> {
  const problem = validateImageUrl(input);
  if (problem) throw new Error(problem);
  let response: Response;
  try {
    response = await fetch(input.trim(), { mode: "cors", referrerPolicy: "no-referrer" });
  } catch {
    throw new Error("We couldn’t use that link. Upload the image instead.");
  }
  if (!response.ok) {
    throw new Error("We couldn’t use that link. Upload the image instead.");
  }
  const blob = await response.blob();
  const type = blob.type;
  const loose =
    type === "" ||
    type === "application/octet-stream" ||
    type === "image/jpeg" ||
    type === "image/png" ||
    type === "image/webp";
  if (!loose) throw new Error("Use a JPG, PNG, or WebP image.");
  if (blob.size > LIMITS.avatarBytes) {
    throw new Error("That image is over 2 MB. Try a smaller one.");
  }
  const dataUrl = await readBlob(blob);
  return downscale(dataUrl);
}
