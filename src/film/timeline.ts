import shotlist from "../../production/shotlist-v1.json";

export const FPS = shotlist.fps;
export const TRANSITION_FRAMES = shotlist.transition_frames;
export const WIDTH = shotlist.canvas.width;
export const HEIGHT = shotlist.canvas.height;
export const TOTAL_FRAMES = shotlist.duration_frames;
export const TOTAL_SECONDS = shotlist.duration_seconds;
export const SHOTS = shotlist.shots;

export type ShotId = (typeof SHOTS)[number]["id"];
export type Shot = (typeof SHOTS)[number];

export interface FrameAddress {
  frame: number;
  shot: Shot;
  shotIndex: number;
  localFrame: number;
  localTime: number;
}

export function clampFrame(value: number): number {
  return Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(value)));
}

export function locateFrame(value: number): FrameAddress {
  const frame = clampFrame(value);
  const shotIndex = SHOTS.findIndex((shot) => frame >= shot.start_frame && frame < shot.end_frame_exclusive);
  const safeIndex = Math.max(0, shotIndex);
  const shot = SHOTS[safeIndex] as Shot;
  const localFrame = frame - shot.start_frame;
  return { frame, shot, shotIndex: safeIndex, localFrame, localTime: localFrame / FPS };
}

export function frameAtTime(seconds: number): number {
  return clampFrame(Math.round(Math.max(0, Math.min(TOTAL_SECONDS, seconds)) * FPS));
}

export function formatTime(frame: number): string {
  const seconds = clampFrame(frame) / FPS;
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  return `${minutes}:${(seconds % 60).toFixed(2).padStart(5, "0")}`;
}

export function smoothstep(start: number, end: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return x * x * (3 - 2 * x);
}
