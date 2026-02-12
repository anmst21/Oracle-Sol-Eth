import * as THREE from "three";

const TILE_SIZE = 64;
const TILE_COUNT = 8;

export const PATTERN_COUNT = TILE_COUNT;

let sharedAtlas: { texture: THREE.Texture; length: number } | null = null;

export function getPatternAtlas(): { texture: THREE.Texture; length: number } {
  if (sharedAtlas) return sharedAtlas;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = TILE_COUNT * TILE_SIZE;
  canvas.height = TILE_SIZE;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < TILE_COUNT; i++) {
    const ox = i * TILE_SIZE;
    const size = TILE_SIZE;
    const cx = ox + size / 2;
    const cy = size / 2;

    if (i === 0) {
      // Subtle checkerboard
      const half = size / 2;
      ctx.globalAlpha = 0.12;
      ctx.fillRect(ox, 0, half, half);
      ctx.fillRect(ox + half, half, half, half);
      ctx.globalAlpha = 1;
    } else if (i === 1) {
      // Two small dashes stacked
      ctx.fillRect(ox + 20, cy - 8, 24, 2);
      ctx.fillRect(ox + 20, cy + 6, 24, 2);
    } else if (i === 2) {
      // Four-dot grid
      const d = 4;
      const sp = 10;
      ctx.fillRect(cx - sp, cy - sp, d, d);
      ctx.fillRect(cx + sp - d, cy - sp, d, d);
      ctx.fillRect(cx - sp, cy + sp - d, d, d);
      ctx.fillRect(cx + sp - d, cy + sp - d, d, d);
    } else if (i === 3) {
      // Diagonal stripes (sparse)
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      for (let d = -size; d < size * 2; d += 12) {
        ctx.moveTo(ox + d, 0);
        ctx.lineTo(ox + d + size, size);
      }
      ctx.stroke();
    } else if (i === 4) {
      // Hash/pound sign shape
      const t = 2;
      const gap = 8;
      ctx.fillRect(cx - gap, cy - 16, t, 32);
      ctx.fillRect(cx + gap, cy - 16, t, 32);
      ctx.fillRect(cx - 16, cy - gap, 32, t);
      ctx.fillRect(cx - 16, cy + gap, 32, t);
    } else if (i === 5) {
      // Dense diagonal stripes
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.beginPath();
      for (let d = -size; d < size * 2; d += 8) {
        ctx.moveTo(ox + d, 0);
        ctx.lineTo(ox + d + size, size);
      }
      ctx.stroke();
    } else if (i === 6) {
      // Dense dot grid
      const d = 4;
      for (let y = 4; y < size; y += 10) {
        for (let x = 4; x < size; x += 10) {
          ctx.fillRect(ox + x, y, d, d);
        }
      }
    } else {
      // Full block
      ctx.fillRect(ox + 2, 2, size - 4, size - 4);
    }
  }

  const tex = new THREE.Texture(canvas);
  tex.needsUpdate = true;
  sharedAtlas = { texture: tex, length: TILE_COUNT };
  return sharedAtlas;
}
