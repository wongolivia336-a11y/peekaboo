import assert from "node:assert/strict";

const duration = 10;
const samples = [0, 0.5, 2.5, 5, 7.5, 10];
const signal = (time, phase, frequency) => {
  const fadeIn = Math.min(1, Math.max(0, (time / 1.4)));
  const fadeOut = 1 - Math.min(1, Math.max(0, (time - 8.1) / 1.9));
  const envelope = Math.min(fadeIn * fadeIn * (3 - 2 * fadeIn), fadeOut * fadeOut * (3 - 2 * fadeOut));
  return (Math.sin(time * frequency + phase) * 0.56 + Math.sin(time * frequency * 0.47 + phase * 1.9 + 0.7) * 0.28 + Math.sin(time * frequency * 1.83 + phase * 0.37 - 1.1) * 0.16) * envelope;
};

for (const t of samples) {
  assert.equal(Number.isFinite(signal(t, 0.4, 0.82)), true);
  assert.equal(Number.isFinite(signal(t, 2.2, 0.67)), true);
}
assert.ok(Math.abs(signal(0, 0.4, 0.82)) < 1e-8);
assert.ok(Math.abs(signal(10, 0.4, 0.82)) < 1e-8);
assert.notEqual(signal(3, 0.4, 0.82), signal(3, 2.2, 0.67));
assert.equal(samples.at(-1), duration);
console.log("timeline deterministic smoke: PASS");


