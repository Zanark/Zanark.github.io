import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { nextChannel, normalizeTheme, assessEvidence, matchesProject, CHANNEL_IDS } from "../src/lib/display.mjs";

test("dark is the default; only the explicit light choice overrides it", () => {
  for (const input of [null, undefined, "", "system", "DARK", "false"]) assert.equal(normalizeTheme(input), "dark");
  assert.equal(normalizeTheme("light"), "light");
});
test("channel controls wrap in both directions", () => {
  assert.equal(nextChannel("signal", -1), "contact");
  assert.equal(nextChannel("contact", 1), "signal");
  assert.equal(nextChannel("projects", 1), "story");
  assert.equal(new Set(CHANNEL_IDS).size, 6);
});
test("missing evidence never produces a ready result", () => {
  for (const current of [false, true]) for (const compatible of [false, true]) {
    assert.equal(assessEvidence({ collected: false, current, compatible }).state, "unknown");
  }
});
test("stale, blocked and human-review states stay distinct", () => {
  assert.equal(assessEvidence({ collected: true, current: false, compatible: true }).state, "stale");
  assert.equal(assessEvidence({ collected: true, current: true, compatible: false }).state, "blocked");
  assert.equal(assessEvidence({ collected: true, current: true, compatible: true }).state, "review");
});
test("project filters retain all items or select their actual category", () => {
  assert.equal(matchesProject("creative", "all"), true);
  assert.equal(matchesProject("creative", "creative"), true);
  assert.equal(matchesProject("experiment", "engineering"), false);
});
test("original art is self-contained without external media or executable content", () => {
  for (const name of readdirSync(new URL("../public/art/", import.meta.url))) {
    const svg = readFileSync(new URL(`../public/art/${name}`, import.meta.url), "utf8");
    assert.match(svg, /<svg/);
    assert.doesNotMatch(svg, /<script|<foreignObject|(?:href|src)=["']https?:/i);
  }
});
test("public preview source does not import the private research pack", () => {
  for (const file of ["../src/data/portfolio.ts", "../src/pages/index.astro", "../src/layouts/Television.astro"]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.doesNotMatch(source, /\.portfolio-input|\.agent-context|CAREER-\d|SRC-P\d|portal\.microsofticm/);
  }
});
test("the local workflow cannot automatically publish the preview", () => {
  const workflow = readFileSync(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8");
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /^\s+push:|deploy-pages|upload-pages-artifact|pages:\s*write|id-token:\s*write/m);
});
