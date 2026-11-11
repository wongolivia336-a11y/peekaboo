import { mkdirSync, statSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const edge = process.env.PEEKABOO_EDGE ?? "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = process.env.PEEKABOO_PORT ?? "4173";
const evidenceDir = join(root, "edits", "evidence");
const profileDir = join(evidenceDir, ".edge-capture-evidence");
const checkpoints = [0, 2.5, 5, 7.5, 10];

mkdirSync(evidenceDir, { recursive: true });

function runEdge(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(edge, args, { stdio: "ignore", windowsHide: true });
    child.once("error", reject);
    child.once("close", (code) => code === 0 ? resolve() : reject(new Error(`Edge exited with code ${code}`)));
  });
}

async function capture(time, output) {
  const url = `http://127.0.0.1:${port}/?capture=1&t=${time}`;
  await runEdge([
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1448,1086",
    "--virtual-time-budget=12000",
    `--user-data-dir=${profileDir}`,
    `--screenshot=${output}`,
    url,
  ]);
  const bytes = statSync(output).size;
  if (bytes < 10000) throw new Error(`Capture is unexpectedly small: ${output} (${bytes} bytes)`);
  console.log(JSON.stringify({ time, output, bytes }));
}

for (const time of checkpoints) {
  const label = String(Math.round(time * 1000)).padStart(5, "0");
  await capture(time, join(evidenceDir, `SH03-t${label}.png`));
}


