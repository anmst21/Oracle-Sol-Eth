import * as THREE from "three";

const CHARS = " ./|\\-_=+<>[]{}()";
const CELL = 96;

let sharedAtlas: THREE.Texture | null = null;

export const CHAR_COUNT = CHARS.length;

function getHandjetFamily(): string {
  // Next.js sets --font-handjet as a CSS variable with the mangled family name
  const raw = getComputedStyle(document.body).getPropertyValue("--font-handjet").trim();
  if (raw) return raw;
  // Fallback: try the original name (works in dev if loaded via @font-face)
  return "'Handjet', monospace";
}

export async function getAsciiAtlas(): Promise<THREE.Texture> {
  if (sharedAtlas) return sharedAtlas;

  const canvas = document.createElement("canvas");
  canvas.width = CHARS.length * CELL;
  canvas.height = CELL;

  const ctx = canvas.getContext("2d")!;

  const fontFamily = getHandjetFamily();

  // Wait for fonts to be ready
  await document.fonts.ready;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 80px ${fontFamily}, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < CHARS.length; i++) {
    ctx.fillText(CHARS[i], CELL / 2 + i * CELL, CELL / 2);
  }

  sharedAtlas = new THREE.Texture(canvas);
  sharedAtlas.needsUpdate = true;
  return sharedAtlas;
}
