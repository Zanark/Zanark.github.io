const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const site = join(__dirname, "..", "site");
const css = readFileSync(join(site, "palette.css"), "utf8");
const parseTokens = (block) => Object.fromEntries(
  [...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6,8});/gi)].map((match) => [match[1], match[2]]),
);
const dark = parseTokens(css.match(/:root\s*\{([^}]+)\}/)[1]);
const light = { ...dark, ...parseTokens(css.match(/:root\[data-theme="light"\]\s*\{([^}]+)\}/)[1]) };
const channels = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
const luminance = (rgb) => rgb.map((value) => value / 255)
  .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4)
  .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (foreground, background) => {
  const values = [luminance(channels(foreground)), luminance(channels(background))].sort((a, b) => a - b);
  return (values[1] + 0.05) / (values[0] + 0.05);
};
const composite = (foreground, background) => {
  const alpha = parseInt(foreground.slice(7, 9), 16) / 255;
  const bg = channels(background);
  return "#" + channels(foreground)
    .map((value, index) => Math.round(value * alpha + bg[index] * (1 - alpha)).toString(16).padStart(2, "0"))
    .join("");
};

test("dark mode preserves canonical DeepSeaFoam semantic roles", () => {
  const canonical = {
    background: "#000F13", surface: "#001E26", text: "#93A1A1",
    muted: "#839496", heading: "#EEE8D5", border: "#586E75", accent: "#00A591",
    document: "#45D072", warning: "#EBE565", error: "#E84A5F",
  };
  for (const [name, value] of Object.entries(canonical)) assert.equal(dark[name], value, name);
});

for (const [name, palette] of Object.entries({ dark, light })) {
  test(`${name} text, focus and action colors retain their contrast thresholds`, () => {
    for (const surface of ["background", "surface", "paper"]) {
      for (const role of ["text", "muted", "heading", "accent", "document", "warning", "error"]) {
        const ratio = contrast(palette[role], palette[surface]);
        assert.ok(ratio >= 4.5, `${name} ${role}/${surface}: ${ratio}`);
      }
      assert.ok(contrast(palette.border, palette[surface]) >= 3, `${name} control border/${surface}`);
      assert.ok(contrast(palette.accent, palette[surface]) >= 3, `${name} focus/${surface}`);
      const selected = composite(palette.selection, palette[surface]);
      assert.ok(contrast(palette.heading, selected) >= 4.5, `${name} selection/${surface}`);
    }
    for (const background of ["accent", "accent-hover"]) {
      assert.ok(contrast(palette["button-text"], palette[background]) >= 4.5, `${name} button/${background}`);
    }
    assert.ok(contrast(palette["safety-ink"], palette["safety-fill"]) >= 7);
  });
}

test("light mode adapts rather than inverts the dark accent", () => {
  assert.equal(light.background, "#F3F2E9");
  assert.equal(light.accent, "#006F63");
  assert.ok(contrast(dark.accent, light.background) < 4.5);
  assert.ok(contrast(light.accent, light.background) >= 4.5);
});

test("text selected on filled actions retains the contrasting button ink", () => {
  const styles = readFileSync(join(site, "styles.css"), "utf8");
  assert.match(styles, /\.button::selection,\s*\.button \*::selection\s*\{\s*color: var\(--button-text\);\s*background: var\(--accent-hover\);/);
  for (const palette of [dark, light]) {
    assert.ok(contrast(palette["button-text"], palette["accent-hover"]) >= 4.5);
  }
});

test("both pages share the palette, theme behavior and existing local assets", () => {
  for (const name of ["index.html", "404.html"]) {
    const html = readFileSync(join(site, name), "utf8");
    assert.match(html, /<html lang="en" data-theme="dark">/);
    assert.match(html, /<meta name="theme-color" content="#000F13">/);
    assert.match(html, /href="\/palette.css"/);
    assert.match(html, /src="\/theme.js"/);
    for (const match of html.matchAll(/(?:href|src)="\/([^"]*)"/g)) {
      assert.ok(existsSync(join(site, match[1] || "index.html")), `${name}: ${match[1]}`);
    }
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${name}: duplicate ids`);
  }
});

test("construction motion has native pause control and a reduced-motion fallback", () => {
  const html = readFileSync(join(site, "index.html"), "utf8");
  const styles = readFileSync(join(site, "styles.css"), "utf8");
  assert.match(html, /id="pause-motion" aria-label="Pause construction animation"/);
  assert.match(html, /for="pause-motion"/);
  assert.match(styles, /#pause-motion:checked ~ \.site-scene \*\s*\{\s*animation-play-state: paused/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.site-scene \*\s*\{\s*animation: none/);
});

test("browser theme-color matches the palette's actual base colors", () => {
  const script = readFileSync(join(site, "theme.js"), "utf8");
  assert.ok(script.includes(`theme === "light" ? "${light.background}" : "${dark.background}"`));
});
