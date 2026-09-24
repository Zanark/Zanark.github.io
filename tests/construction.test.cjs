const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const site = join(__dirname, "..", "site");
const styles = readFileSync(join(site, "styles.css"), "utf8");
const home = readFileSync(join(site, "index.html"), "utf8");
const fontName = "barlow-condensed-800-latin.woff2";

test("construction type is a local, unmodified WOFF2 with its redistribution license", () => {
  const font = readFileSync(join(site, fontName));
  assert.equal(font.subarray(0, 4).toString(), "wOF2");
  assert.equal(font.length, 22464);
  assert.equal(createHash("sha256").update(font).digest("hex"),
    "2515494e8cc2ca07c86ea78766cfa104b796aa6ed5d66821c01d51dbb0b52bce");
  const license = readFileSync(join(site, "font-LICENSE.txt"), "utf8");
  assert.match(license, /Copyright 2017 The Barlow Project Authors/);
  assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/);
  assert.match(styles, /src: url\("\/barlow-condensed-800-latin\.woff2"\) format\("woff2"\)/);
  assert.match(styles, /font-display: swap/);
});

test("both signs preload condensed type and remove editorial italics", () => {
  for (const name of ["index.html", "404.html"]) {
    const html = readFileSync(join(site, name), "utf8");
    assert.match(html, /rel="preload" href="\/barlow-condensed-800-latin\.woff2" as="font" type="font\/woff2" crossorigin/);
    const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1];
    assert.doesNotMatch(heading, /<em\b/);
  }
  const headingStyles = styles.match(/\nh1 \{([^}]+)\}/)[1];
  assert.match(headingStyles, /font-family: var\(--sign-font\)/);
  assert.match(headingStyles, /font-style: normal/);
  assert.match(headingStyles, /font-weight: 800/);
  assert.match(headingStyles, /text-transform: uppercase/);
  assert.doesNotMatch(styles, /Georgia|Times New Roman/);
});

test("three distinct workers share hard hats and high-visibility vests", () => {
  assert.equal([...home.matchAll(/class="worker worker-/g)].length, 3);
  assert.equal([...home.matchAll(/<use href="#crew-head"/g)].length, 3);
  assert.equal([...home.matchAll(/<use href="#crew-vest"/g)].length, 3);
  for (const part of ["worker-hammer-arm", "worker-signal-arm", "worker-haul-motion"]) {
    assert.ok(home.includes(`class="${part}"`));
    assert.ok(styles.includes(`.${part} {`));
  }
});

test("warning-band lettering retains a contrasting selected state", () => {
  assert.match(home, /<span class="sign-action">at work<\/span>/);
  assert.match(styles, /\.sign-action::selection \{\s*color: var\(--safety-fill\);\s*background: var\(--safety-ink\);/);
});
