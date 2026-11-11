export const DURATION_SECONDS = 10;
export const FPS = 24;

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

export function smoothstep(edge0: number, edge1: number, value: number): number {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

export function easeInOut(value: number): number {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
}

export function fadeEnvelope(time: number): number {
  const fadeIn = smoothstep(0, 1.4, time);
  const fadeOut = 1 - smoothstep(8.1, 10, time);
  return Math.min(fadeIn, fadeOut);
}

/**
 * An intentionally non-synchronous wind signal. Each leaf owner gets a
 * different phase/frequency pair; the second harmonic prevents a metronomic
 * loop without adding global displacement.
 */
export function windSignal(time: number, phase: number, frequency: number): number {
  const a = Math.sin(time * frequency + phase);
  const b = Math.sin(time * (frequency * 0.47) + phase * 1.9 + 0.7);
  const c = Math.sin(time * (frequency * 1.83) + phase * 0.37 - 1.1);
  return (a * 0.56 + b * 0.28 + c * 0.16) * fadeEnvelope(time);
}

export function formatTime(time: number): string {
  const safe = Math.max(0, Math.min(DURATION_SECONDS, time));
  const minutes = Math.floor(safe / 60).toString().padStart(2, "0");
  const seconds = (safe % 60).toFixed(2).padStart(5, "0");
  return `${minutes}:${seconds}`;
}


