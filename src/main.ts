import { ARTBOARD, createPeekabooScene } from "./scene/createPeekabooScene";
import { DURATION_SECONDS, FPS, formatTime } from "./scene/timeline";
import "./styles.css";

const isCapture = new URLSearchParams(window.location.search).get("capture") === "1";
const initialTime = Number(new URLSearchParams(window.location.search).get("t") ?? 0);

function reportRuntimeError(error: unknown): void {
  const panel = document.createElement("pre");
  panel.className = "runtime-error";
  panel.textContent = `Runtime error\n${error instanceof Error ? error.stack ?? error.message : String(error)}`;
  document.body.appendChild(panel);
}
window.addEventListener("error", (event) => reportRuntimeError(event.error ?? event.message));
window.addEventListener("unhandledrejection", (event) => reportRuntimeError(event.reason));

const host = document.querySelector<HTMLDivElement>("#stage-host");
const loading = document.querySelector<HTMLDivElement>("#loading");
if (!host || !loading) throw new Error("Stage host is missing");
const stageHost = host;
if (isCapture) document.body.classList.add("capture-mode");

const { Application } = (globalThis as any).PIXI as { Application: any };
const originalAddEventListener = EventTarget.prototype.addEventListener;
const pixiEventSystem = (globalThis as any).PIXI.EventSystem;
const originalBootstrapEvent = pixiEventSystem?.prototype?._bootstrapEvent;
if (isCapture) {
  // Edge headless can emit one malformed synthetic pointer event during Pixi's
  // renderer bootstrap. Keep the normal browser event path intact, but make
  // deterministic capture resilient to that browser-only quirk.
  if (originalBootstrapEvent) {
    pixiEventSystem.prototype._bootstrapEvent = function (event: any, nativeEvent: any): any {
      if (!nativeEvent || typeof nativeEvent.type !== "string") {
        nativeEvent = Object.assign({ type: "pointermove" }, nativeEvent ?? {});
      }
      return originalBootstrapEvent.call(this, event, nativeEvent);
    };
  }
  EventTarget.prototype.addEventListener = function (this: EventTarget, type: string, listener: any, options?: any): void {
    if (/^(pointer|mouse|touch|wheel|contextmenu)/.test(type)) return;
    originalAddEventListener.call(this, type, listener, options);
  } as typeof EventTarget.prototype.addEventListener;
}
const app = new Application();
await app.init({
  width: ARTBOARD.width,
  height: ARTBOARD.height,
  backgroundAlpha: 0,
  antialias: true,
  resolution: 1,
  autoDensity: true,
  eventMode: "none",
  eventFeatures: { move: false, globalMove: false, click: false, wheel: false },
});
if (isCapture) EventTarget.prototype.addEventListener = originalAddEventListener;
if (isCapture && originalBootstrapEvent) {
  pixiEventSystem.prototype._bootstrapEvent = originalBootstrapEvent;
}
stageHost.appendChild(app.canvas);
app.canvas.setAttribute("aria-label", "SH03 canvas render");

const scene = await createPeekabooScene();
app.stage.addChild(scene.root);
loading.remove();

let currentTime = Number.isFinite(initialTime) ? Math.max(0, Math.min(DURATION_SECONDS, initialTime)) : 0;
let playing = !isCapture;
let last = performance.now();

function resize(): void {
  const rect = stageHost.getBoundingClientRect();
  const scale = Math.min(rect.width / ARTBOARD.width, rect.height / ARTBOARD.height);
  scene.root.scale.set(scale);
  scene.root.position.set(
    (rect.width - ARTBOARD.width * scale) / 2,
    (rect.height - ARTBOARD.height * scale) / 2,
  );
  app.renderer.resize(rect.width, rect.height);
}

new ResizeObserver(resize).observe(stageHost);
resize();
scene.renderAtTime(currentTime);

const scrub = document.querySelector<HTMLInputElement>("#scrub");
const timeReadout = document.querySelector<HTMLOutputElement>("#time-readout");
const intensity = document.querySelector<HTMLInputElement>("#intensity");
const intensityReadout = document.querySelector<HTMLOutputElement>("#intensity-readout");
const sourceMode = document.querySelector<HTMLSelectElement>("#source-mode");
const exportStatus = document.querySelector<HTMLSpanElement>("#export-status");

function updateUi(): void {
  if (scrub) scrub.value = currentTime.toFixed(3);
  if (timeReadout) timeReadout.value = formatTime(currentTime);
}

function seek(time: number): void {
  currentTime = Math.max(0, Math.min(DURATION_SECONDS, time));
  scene.renderAtTime(currentTime);
  updateUi();
}

document.querySelector<HTMLButtonElement>("#play")?.addEventListener("click", () => { playing = true; });
document.querySelector<HTMLButtonElement>("#pause")?.addEventListener("click", () => { playing = false; });
document.querySelector<HTMLButtonElement>("#reset")?.addEventListener("click", () => { playing = false; seek(0); });
scrub?.addEventListener("input", () => seek(Number(scrub.value)));
intensity?.addEventListener("input", () => {
  const value = Number(intensity.value);
  intensityReadout?.replaceChildren(`${Math.round(value * 100)}%`);
  scene.setSettings({ intensity: value });
  scene.renderAtTime(currentTime);
});
sourceMode?.addEventListener("change", () => {
  scene.setSettings({ sourceMode: sourceMode.value as "separated" | "original" });
  scene.renderAtTime(currentTime);
});
document.querySelector<HTMLInputElement>("#show-masks")?.addEventListener("change", (event) => {
  scene.setSettings({ showMasks: (event.target as HTMLInputElement).checked });
  scene.renderAtTime(currentTime);
});

for (const toggle of document.querySelectorAll<HTMLInputElement>("[data-layer]")) {
  toggle.addEventListener("change", () => {
    const key = toggle.dataset.layer as "school" | "trunk" | "foliageRear" | "boy" | "foliageFront" | "shadow";
    scene.setLayerVisible(key, toggle.checked);
  });
}

document.querySelector<HTMLButtonElement>("#export-frame")?.addEventListener("click", () => {
  const anchor = document.createElement("a");
  anchor.download = `SH03-${currentTime.toFixed(3).replace(".", "_")}.png`;
  anchor.href = app.canvas.toDataURL("image/png");
  anchor.click();
  if (exportStatus) exportStatus.textContent = "PNG frame saved";
});

document.querySelector<HTMLButtonElement>("#export-video")?.addEventListener("click", () => {
  const canvas = app.canvas as HTMLCanvasElement & { captureStream?: (frameRate?: number) => MediaStream };
  if (!canvas.captureStream || typeof MediaRecorder === "undefined") {
    if (exportStatus) exportStatus.textContent = "Video capture is not supported in this browser";
    return;
  }
  const mimeType = ["video/webm;codecs=vp9", "video/webm"].find((candidate) => MediaRecorder.isTypeSupported(candidate));
  if (!mimeType) {
    if (exportStatus) exportStatus.textContent = "No WebM encoder available";
    return;
  }
  playing = false;
  seek(0);
  const stream = canvas.captureStream(FPS);
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
  const chunks: Blob[] = [];
  const started = performance.now();
  recorder.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data); };
  recorder.onstop = () => {
    stream.getTracks().forEach((track) => track.stop());
    const url = URL.createObjectURL(new Blob(chunks, { type: mimeType }));
    const anchor = document.createElement("a");
    anchor.download = "SH03-10s-24fps.webm";
    anchor.href = url;
    anchor.click();
    URL.revokeObjectURL(url);
    if (exportStatus) exportStatus.textContent = "WebM video saved";
  };
  recorder.start();
  if (exportStatus) exportStatus.textContent = "Recording 10s WebM…";
  const captureTick = (now: number): void => {
    const elapsed = (now - started) / 1000;
    seek(Math.min(DURATION_SECONDS, elapsed));
    if (elapsed >= DURATION_SECONDS) recorder.stop();
    else requestAnimationFrame(captureTick);
  };
  requestAnimationFrame(captureTick);
});

function tick(now: number): void {
  const delta = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (playing && !isCapture) {
    currentTime += delta;
    if (currentTime > DURATION_SECONDS) {
      currentTime = DURATION_SECONDS;
      playing = false;
    }
    scene.renderAtTime(currentTime);
    updateUi();
  }
  requestAnimationFrame(tick);
}

updateUi();
if (isCapture) {
  // The query-string time is applied before the first screenshot. Keeping the
  // page paused makes Edge's headless capture deterministic.
  seek(currentTime);
} else {
  requestAnimationFrame(tick);
}

window.addEventListener("beforeunload", () => {
  scene.destroy();
  app.destroy(true, { children: true });
});


