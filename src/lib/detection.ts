export type QualitativeStatus = "ok" | "warn" | "alert";

interface DetectionInput {
  currentBPM: number;
  restingBPM: number;
  toleranceBPM: number;
  recentBPMs: number[];
}

export function detectAnomaly({
  currentBPM,
  restingBPM,
  toleranceBPM,
  recentBPMs,
}: DetectionInput): QualitativeStatus {
  if (currentBPM <= 0 || recentBPMs.length === 0) return "ok";

  const lower = restingBPM - toleranceBPM;
  const upper = restingBPM + toleranceBPM;

  const outside = recentBPMs.filter((b) => b > 0 && (b < lower || b > upper)).length;
  const ratio = outside / recentBPMs.length;

  if (currentBPM < lower || currentBPM > upper) {
    if (ratio >= 0.5) return "alert";
    if (ratio >= 0.25) return "warn";
  }

  if (ratio >= 0.4) return "warn";

  return "ok";
}

export function isBPMInRange(
  bpm: number,
  restingBPM: number,
  toleranceBPM: number
): boolean {
  return bpm >= restingBPM - toleranceBPM && bpm <= restingBPM + toleranceBPM;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = src;
  });
}

function computeHalfDiff(data: Uint8ClampedArray, size: number): number {
  const half = Math.floor(size / 2);
  let totalDiff = 0;
  let pixelCount = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < half; x++) {
      const lIdx = (y * size + x) * 4;
      const rIdx = (y * size + (size - 1 - x)) * 4;
      const lLum = 0.299 * data[lIdx] + 0.587 * data[lIdx + 1] + 0.114 * data[lIdx + 2];
      const rLum = 0.299 * data[rIdx] + 0.587 * data[rIdx + 1] + 0.114 * data[rIdx + 2];
      totalDiff += Math.abs(lLum - rLum);
      pixelCount++;
    }
  }
  return totalDiff / pixelCount;
}

export async function evaluateFacialSymmetry(
  baselineImage: string | null,
  currentImage: string
): Promise<number> {
  const size = 200;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return 95;

  const img = await loadImage(currentImage);
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  const avgDiff = computeHalfDiff(data, size);
  let score = Math.round(Math.max(0, Math.min(100, 100 - avgDiff * 0.85)));

  if (baselineImage) {
    const baseline = await loadImage(baselineImage);
    ctx.drawImage(baseline, 0, 0, size, size);
    const bData = ctx.getImageData(0, 0, size, size).data;
    const bAvg = computeHalfDiff(bData, size);
    const delta = Math.abs(avgDiff - bAvg);
    score = Math.round(Math.max(0, Math.min(100, 100 - (avgDiff * 0.5 + delta * 0.7))));
  }

  return score;
}
