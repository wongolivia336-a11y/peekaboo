import { createSevenShotScene } from "./film/createSevenShotScene";
import { FPS, HEIGHT, SHOTS, TOTAL_FRAMES, TOTAL_SECONDS, WIDTH, formatTime } from "./film/timeline";
import "./styles.css";

type ShotMeta = (typeof SHOTS)[number];
const params = new URLSearchParams(window.location.search);
const captureMode = params.get("capture") === "1";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const requestedFrame = Number(params.get("frame") ?? 0);

let reported = false;
function reportRuntimeError(error: unknown): void {
  if (reported) return;
  reported = true;
  const panel = document.createElement("pre");
  panel.className = "runtime-error";
  panel.textContent = `运行错误\n${error instanceof Error ? error.stack ?? error.message : String(error)}`;
  document.body.appendChild(panel);
}
window.addEventListener("error", (event) => reportRuntimeError(event.error ?? event.message));
window.addEventListener("unhandledrejection", (event) => reportRuntimeError(event.reason));

const stageHost = document.querySelector<HTMLDivElement>("#stage-host");
const loading = document.querySelector<HTMLDivElement>("#loading");
if (!stageHost || !loading) throw new Error("Missing film stage host");
if (captureMode) document.body.classList.add("capture-mode");

const PIXI = (globalThis as any).PIXI;
const app = new PIXI.Application();
await app.init({ width: WIDTH, height: HEIGHT, background: "#171814", antialias: true, resolution: 1, autoDensity: false, autoStart: false });
app.ticker.stop();
stageHost.appendChild(app.canvas);
app.canvas.setAttribute("aria-label", "PEEKABOO 1448 by 1086 animated frame");

const scene = await createSevenShotScene();
app.stage.addChild(scene.root);
loading.remove();

const scrub = document.querySelector<HTMLInputElement>("#scrub")!;
const timeReadout = document.querySelector<HTMLOutputElement>("#time-readout")!;
const frameReadout = document.querySelector<HTMLSpanElement>("#frame-readout")!;
const shotCaption = document.querySelector<HTMLSpanElement>("#shot-caption")!;
const shotTitle = document.querySelector<HTMLSpanElement>("#active-shot")!;
const shotClock = document.querySelector<HTMLSpanElement>("#shot-clock")!;
const shotStatus = document.querySelector<HTMLSpanElement>("#shot-status")!;
const motionNote = document.querySelector<HTMLParagraphElement>("#motion-note")!;
const layerName = document.querySelector<HTMLDivElement>("#layer-name")!;
const exportStatus = document.querySelector<HTMLDivElement>("#export-status")!;
const trackHost = document.querySelector<HTMLDivElement>("#shot-track")!;
const intensityInput = document.querySelector<HTMLInputElement>("#intensity")!;
const intensityReadout = document.querySelector<HTMLOutputElement>("#intensity-readout")!;
const originalMode = document.querySelector<HTMLSelectElement>("#source-mode")!;

let frame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(requestedFrame)));
let playing = !captureMode && !reducedMotion;
let playAnchor = performance.now();
let playAnchorFrame = frame;
let exporting = false;
let soundtrack: HTMLAudioElement | null = null;
let audioContext: AudioContext | null = null;
let audioDestination: MediaStreamAudioDestinationNode | null = null;
let soundtrackUrl: string | null = null;

function activeShot(): ShotMeta {
  return SHOTS.find((shot) => frame >= shot.start_frame && frame < shot.end_frame_exclusive) ?? SHOTS[0]!;
}

function drawFrame(nextFrame: number): void {
  frame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.floor(nextFrame)));
  scene.renderAtFrame(frame);
  app.renderer.render(app.stage);
}

function seek(nextFrame: number, syncAudio = true): void {
  drawFrame(nextFrame);
  if (syncAudio && soundtrack && Number.isFinite(soundtrack.duration)) {
    const nextTime = Math.min(frame / FPS, Math.max(0, soundtrack.duration - 0.04));
    if (Math.abs(soundtrack.currentTime - nextTime) > 0.04) soundtrack.currentTime = nextTime;
  }
  updateUi();
}

function updateUi(): void {
  const shot = activeShot();
  const localFrame = frame - shot.start_frame;
  const localTime = localFrame / FPS;
  const shotDuration = shot.duration_frames / FPS;
  const displayName = `${shot.id} · ${shot.title_zh}`;
  scrub.value = String(frame);
  timeReadout.value = formatTime(frame);
  frameReadout.textContent = `FRAME ${String(frame).padStart(4, "0")} / ${TOTAL_FRAMES}`;
  shotCaption.textContent = displayName;
  shotTitle.textContent = displayName;
  shotClock.textContent = `${localTime.toFixed(2).padStart(5, "0")} / ${shotDuration.toFixed(2).padStart(5, "0")}`;
  shotStatus.textContent = shot.status.toUpperCase().replaceAll("-", " ");
  motionNote.textContent = shot.animation;
  layerName.textContent = `当前素材：${shot.layers.join(" · ")}`;
  trackHost.querySelectorAll<HTMLButtonElement>(".shot-segment").forEach((button) => {
    button.classList.toggle("active", button.dataset.shot === shot.id);
  });
}

function fitCanvas(): void {
  const rect = stageHost!.getBoundingClientRect();
  const scale = Math.max(0, Math.min(rect.width / WIDTH, rect.height / HEIGHT));
  app.canvas.style.width = `${Math.round(WIDTH * scale)}px`;
  app.canvas.style.height = `${Math.round(HEIGHT * scale)}px`;
}
new ResizeObserver(fitCanvas).observe(stageHost);
fitCanvas();

for (const shot of SHOTS) {
  const button = document.createElement("button");
  button.className = "shot-segment";
  button.type = "button";
  button.dataset.shot = shot.id;
  button.style.flexGrow = String(shot.duration_frames);
  button.style.flexBasis = "0";
  button.setAttribute("aria-label", `${shot.id} ${shot.title_zh} ${shot.duration_frames / FPS} 秒`);
  button.innerHTML = `${shot.id}<small>${shot.title_zh}</small>`;
  button.addEventListener("click", () => { playing = false; pauseSoundtrack(); seek(shot.start_frame); });
  trackHost.appendChild(button);
}

function pauseSoundtrack(): void { soundtrack?.pause(); }

document.querySelector<HTMLButtonElement>("#play")!.addEventListener("click", async () => {
  if (frame >= TOTAL_FRAMES - 1) seek(0);
  playing = true;
  playAnchor = performance.now();
  playAnchorFrame = frame;
  if (soundtrack) {
    soundtrack.currentTime = Math.min(frame / FPS, Math.max(0, soundtrack.duration - 0.04));
    await audioContext?.resume();
    await soundtrack.play().catch(() => { exportStatus.textContent = "浏览器未允许播放本地音轨"; });
  }
});
document.querySelector<HTMLButtonElement>("#pause")!.addEventListener("click", () => { playing = false; pauseSoundtrack(); });
document.querySelector<HTMLButtonElement>("#reset")!.addEventListener("click", () => { playing = false; pauseSoundtrack(); seek(0); });
document.querySelector<HTMLButtonElement>("#previous-frame")!.addEventListener("click", () => { playing = false; pauseSoundtrack(); seek(frame - 1); });
document.querySelector<HTMLButtonElement>("#next-frame")!.addEventListener("click", () => { playing = false; pauseSoundtrack(); seek(frame + 1); });
scrub.addEventListener("input", () => { playing = false; pauseSoundtrack(); seek(Number(scrub.value)); });
originalMode.addEventListener("change", () => scene.setSourceMode(originalMode.value as "separated" | "original"));
intensityInput.addEventListener("input", () => {
  const value = Number(intensityInput.value);
  intensityReadout.value = `${Math.round(value * 100)}%`;
  scene.setMotionIntensity(value);
  app.renderer.render(app.stage);
});
document.querySelector<HTMLInputElement>("#show-masks")!.addEventListener("change", (event) => {
  scene.setMasksVisible((event.target as HTMLInputElement).checked);
  app.renderer.render(app.stage);
});
document.querySelector<HTMLInputElement>("#layer-background")!.addEventListener("change", (event) => {
  scene.setLayerVisible("background", (event.target as HTMLInputElement).checked);
  app.renderer.render(app.stage);
});
document.querySelector<HTMLInputElement>("#layer-characters")!.addEventListener("change", (event) => {
  scene.setLayerVisible("characters", (event.target as HTMLInputElement).checked);
  app.renderer.render(app.stage);
});

document.querySelector<HTMLInputElement>("#audio-file")!.addEventListener("change", async (event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (soundtrackUrl) URL.revokeObjectURL(soundtrackUrl);
  pauseSoundtrack();
  soundtrackUrl = URL.createObjectURL(file);
  soundtrack = new Audio(soundtrackUrl);
  soundtrack.preload = "auto";
  soundtrack.loop = false;
  audioContext = new AudioContext();
  audioDestination = audioContext.createMediaStreamDestination();
  const source = audioContext.createMediaElementSource(soundtrack);
  source.connect(audioDestination);
  source.connect(audioContext.destination);
  document.querySelector<HTMLSpanElement>("#audio-name")!.textContent = file.name;
  exportStatus.textContent = "本地配乐已载入；导出时与画面同轨";
});

document.querySelector<HTMLButtonElement>("#export-frame")!.addEventListener("click", () => {
  app.renderer.render(app.stage);
  const anchor = document.createElement("a");
  anchor.download = `NOT-FOUND-YET-frame-${String(frame).padStart(4, "0")}.png`;
  anchor.href = (app.canvas as HTMLCanvasElement).toDataURL("image/png");
  anchor.click();
  exportStatus.textContent = `PNG 已导出 · 第 ${frame} 帧`;
});

async function exportVideo(): Promise<void> {
  const canvas = app.canvas as HTMLCanvasElement & { captureStream?: (fps?: number) => MediaStream };
  if (!canvas.captureStream || typeof MediaRecorder === "undefined") {
    exportStatus.textContent = "此浏览器没有可用的 Canvas 视频录制器";
    return;
  }
  const mimeType = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((type) => MediaRecorder.isTypeSupported(type));
  if (!mimeType) { exportStatus.textContent = "此浏览器未提供 WebM 编码器"; return; }
  playing = false;
  pauseSoundtrack();
  seek(0);
  await audioContext?.resume();
  const stream = canvas.captureStream(FPS);
  if (audioDestination) stream.addTrack(audioDestination.stream.getAudioTracks()[0]!);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3_600_000, audioBitsPerSecond: 192_000 });
  const chunks: Blob[] = [];
  const start = performance.now();
  const exactDurationMs = TOTAL_FRAMES / FPS * 1000;
  exporting = true;
  recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
  recorder.onstop = () => {
    exporting = false;
    stream.getTracks().forEach((track) => track.stop());
    pauseSoundtrack();
    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.download = "NOT-FOUND-YET-90s-24fps.webm";
    anchor.href = url;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    exportStatus.textContent = `WebM 已导出 · 90s · 24fps · ${(blob.size / 1024 / 1024).toFixed(1)} MB`;
    seek(0);
  };
  recorder.start(1000);
  if (soundtrack) { soundtrack.currentTime = 0; await soundtrack.play().catch(() => undefined); }
  exportStatus.textContent = "正在逐帧录制 90 秒；请保持标签页打开…";
  const captureTick = (now: number): void => {
    const elapsed = now - start;
    const next = Math.min(TOTAL_FRAMES - 1, Math.floor(elapsed * FPS / 1000));
    if (next !== frame) {
      drawFrame(next);
      if (next % 24 === 0) {
        updateUi();
        exportStatus.textContent = `正在渲染 ${String(next).padStart(4, "0")} / ${TOTAL_FRAMES} 帧`;
      }
    }
    if (elapsed >= exactDurationMs) recorder.stop();
    else requestAnimationFrame(captureTick);
  };
  requestAnimationFrame(captureTick);
}
document.querySelector<HTMLButtonElement>("#export-video")!.addEventListener("click", () => { void exportVideo(); });

function previewTick(now: number): void {
  if (playing && !exporting && !captureMode) {
    const elapsed = now - playAnchor;
    const next = playAnchorFrame + Math.floor(elapsed * FPS / 1000);
    if (next >= TOTAL_FRAMES) {
      playing = false;
      pauseSoundtrack();
      seek(TOTAL_FRAMES - 1, false);
    } else if (next !== frame) {
      drawFrame(next);
      if (next % 2 === 0) updateUi();
    }
  }
  requestAnimationFrame(previewTick);
}

drawFrame(frame);
updateUi();
(window as any).__PEEKABOO__ = {
  seekFrame: (next: number) => { playing = false; seek(next); },
  renderAtFrame: (next: number) => { drawFrame(next); updateUi(); },
  startExport: exportVideo,
  dimensions: [WIDTH, HEIGHT],
  fps: FPS,
  totalFrames: TOTAL_FRAMES,
};
if (params.get("autoExport") === "1") window.setTimeout(() => { void exportVideo(); }, 1200);
if (!captureMode) requestAnimationFrame(previewTick);

window.addEventListener("beforeunload", () => {
  pauseSoundtrack();
  if (soundtrackUrl) URL.revokeObjectURL(soundtrackUrl);
  scene.destroy();
  app.destroy(true, { children: true });
});


