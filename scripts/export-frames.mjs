import { mkdirSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const edge = process.env.PEEKABOO_EDGE ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = process.env.PEEKABOO_PORT ?? "4173";
const fps = 24;
const args = Object.fromEntries(process.argv.slice(2).map((value) => {
  const [key, raw] = value.replace(/^--/, "").split("=");
  return [key, Number(raw)];
}));
const start = Number.isFinite(args.start) ? args.start : 0;
const end = Number.isFinite(args.end) ? args.end : 240;
const outputDir = join(root, "edits", "exports", "SH03", "frames");
const profileDir = join(root, "edits", "exports", "SH03", ".edge-capture-frames");
mkdirSync(outputDir, { recursive: true });

function runEdge(edgeArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(edge, edgeArgs, { stdio: "ignore", windowsHide: true });
    child.once("error", reject);
    child.once("close", (code) => code === 0 ? resolve() : reject(new Error(`Edge exited with code ${code}`)));
  });
}

for (let frame = start; frame <= end; frame += 1) {
  const time = frame / fps;
  const label = String(frame).padStart(4, "0");
  const output = join(outputDir, `SH03-${label}.png`);
  await runEdge([
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1448,1086",
    "--virtual-time-budget=12000",
    `--user-data-dir=${profileDir}`,
    `--screenshot=${output}`,
    `http://127.0.0.1:${port}/?capture=1&t=${time.toFixed(6)}`,
  ]);
  const bytes = statSync(output).size;
  if (bytes < 10000) throw new Error(`Frame is unexpectedly small: ${output} (${bytes} bytes)`);
  console.log(JSON.stringify({ frame, time, output, bytes }));
}


