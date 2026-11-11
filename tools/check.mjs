import fs from 'node:fs';import assert from 'node:assert/strict';
import {TOTAL_FRAMES,SHOTS,locate,WIDTH,HEIGHT} from '../src/timeline.mjs';
const manifest=JSON.parse(fs.readFileSync(new URL('../production/layers-manifest.json',import.meta.url)));
assert.equal(TOTAL_FRAMES,2160);assert.equal(WIDTH/HEIGHT,4/3);assert.equal(SHOTS.length,7);
let n=0;
for(const sh of SHOTS){assert.equal(sh.start,n);n+=sh.length;assert.ok(fs.existsSync(`assets/frames/${sh.id}-v01.png`));
 const cfg=manifest[sh.id];assert.ok(cfg);for(const item of Object.values(cfg.layers))assert.ok(fs.existsSync(item.path))}
assert.equal(n,2160);assert.equal(locate(0).id,'SH01');assert.equal(locate(2159).id,'SH07');
console.log('PASS seven shots, no gaps, 2160 frames, 4:3, source and split layer paths exist');
