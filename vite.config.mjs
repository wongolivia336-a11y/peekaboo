import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "./.deps/node_modules/vite/dist/node/index.js";

const depRoot = path.resolve(".deps/node_modules");
const aliases = {};
for (const entry of fs.readdirSync(depRoot)) {
  if (entry.startsWith(".")) continue;
  if (entry === "vite" || entry === "typescript") continue;
  const entryPath = path.join(depRoot, entry);
  if (entry.startsWith("@")) {
    for (const scoped of fs.readdirSync(entryPath)) {
      aliases[`${entry}/${scoped}`] = path.join(entryPath, scoped);
    }
  } else {
    aliases[entry] = entryPath;
  }
}
aliases["pixi.js"] = path.join(depRoot, "pixi.js/lib/index.js");

export default defineConfig({
  resolve: { alias: aliases },
  server: { strictPort: true },
});


