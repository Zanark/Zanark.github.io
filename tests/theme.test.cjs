const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");
const { runInNewContext } = require("node:vm");

const source = readFileSync(join(__dirname, "..", "site", "theme.js"), "utf8");
const storageKey = "zanark.portfolio.theme";

function loadTheme({ saved = null, readError, writeError } = {}) {
  const events = {};
  const warnings = [];
  const writes = [];
  const root = { dataset: { theme: "dark" } };
  const label = { textContent: "Dark" };
  const toggle = {
    hidden: true,
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener(name, handler) { events[name] = handler; },
  };
  const themeColor = {
    setAttribute(name, value) { this[name] = value; },
  };
  const storage = {
    getItem(key) {
      assert.equal(key, storageKey);
      return saved;
    },
    setItem(key, value) {
      if (writeError) throw writeError;
      writes.push([key, value]);
    },
  };
  const window = {
    get localStorage() {
      if (readError) throw readError;
      return storage;
    },
    addEventListener(name, handler) { events[name] = handler; },
  };
  const document = {
    documentElement: root,
    querySelector(selector) {
      return {
        'meta[name="theme-color"]': themeColor,
        "[data-theme-toggle]": toggle,
        "[data-theme-label]": label,
      }[selector] ?? null;
    },
    addEventListener(name, handler) { events[name] = handler; },
  };
  runInNewContext(source, {
    window, document, DOMException, console: { warn: (message) => warnings.push(message) },
  });
  return { root, toggle, label, themeColor, storage, events, warnings, writes };
}

test("starts dark and does not write a preference just by visiting", () => {
  const app = loadTheme();
  assert.equal(app.root.dataset.theme, "dark");
  assert.equal(app.themeColor.content, "#0b1220");
  assert.equal(app.toggle.hidden, true);
  app.events.DOMContentLoaded();
  assert.equal(app.toggle.hidden, false);
  assert.equal(app.toggle.attributes["aria-checked"], "false");
  assert.equal(app.label.textContent, "Dark");
  assert.equal(app.toggle.title, "Switch to light theme");
  assert.deepEqual(app.writes, []);
});

for (const saved of ["light", "dark"]) {
  test(`restores ${saved} before DOMContentLoaded without an initial animation`, () => {
    const app = loadTheme({ saved });
    assert.equal(app.root.dataset.theme, saved);
    assert.equal(app.root.dataset.themeReady, undefined);
    app.events.DOMContentLoaded();
    assert.equal(app.toggle.attributes["aria-checked"], String(saved === "light"));
    assert.equal(app.themeColor.content, saved === "light" ? "#f6f7f9" : "#0b1220");
  });
}

test("invalid stored choices cannot override the dark default", () => {
  assert.equal(loadTheme({ saved: "automatic" }).root.dataset.theme, "dark");
});

test("toggle updates page, accessible state, label and persisted preference", () => {
  const app = loadTheme();
  app.events.DOMContentLoaded();
  app.events.click();
  assert.equal(app.root.dataset.theme, "light");
  assert.equal(app.toggle.attributes["aria-checked"], "true");
  assert.equal(app.label.textContent, "Light");
  assert.equal(app.toggle.title, "Switch to dark theme");
  assert.equal(app.themeColor.content, "#f6f7f9");
  app.events.click();
  assert.equal(app.root.dataset.theme, "dark");
  assert.equal(app.toggle.attributes["aria-checked"], "false");
  assert.equal(app.themeColor.content, "#0b1220");
  assert.deepEqual(app.writes, [[storageKey, "light"], [storageKey, "dark"]]);
});

test("rapid toggling preserves the latest choice without timers", () => {
  const app = loadTheme();
  app.events.DOMContentLoaded();
  for (let index = 0; index < 9; index++) app.events.click();
  assert.equal(app.root.dataset.theme, "light");
  assert.deepEqual(app.writes.at(-1), [storageKey, "light"]);
});

test("blocked storage retains a working page-only toggle and reports the limit", () => {
  const app = loadTheme({ readError: new DOMException("Denied", "SecurityError") });
  app.events.DOMContentLoaded();
  app.events.click();
  assert.equal(app.root.dataset.theme, "light");
  assert.equal(app.warnings.length, 1);
  assert.deepEqual(app.writes, []);
});

for (const name of ["QuotaExceededError", "SecurityError"]) {
  test(`${name} while saving does not undo the user's theme change`, () => {
    const app = loadTheme({ writeError: new DOMException("Unavailable", name) });
    app.events.DOMContentLoaded();
    app.events.click();
    assert.equal(app.root.dataset.theme, "light");
    assert.equal(app.toggle.attributes["aria-checked"], "true");
    assert.equal(app.warnings.length, 1);
  });
}

test("unexpected storage errors are not swallowed", () => {
  assert.throws(() => loadTheme({ readError: new Error("Unexpected read failure") }),
    /Unexpected read failure/);
  const app = loadTheme({ writeError: new Error("Unexpected write failure") });
  app.events.DOMContentLoaded();
  assert.throws(() => app.events.click(), /Unexpected write failure/);
});

test("saved changes, removals and clearing storage sync without a write loop", () => {
  const app = loadTheme();
  app.events.DOMContentLoaded();
  const sync = (key, newValue) => app.events.storage({ storageArea: app.storage, key, newValue });
  sync(storageKey, "light");
  assert.equal(app.root.dataset.theme, "light");
  assert.equal(app.toggle.attributes["aria-checked"], "true");
  sync(storageKey, null);
  assert.equal(app.root.dataset.theme, "dark");
  sync(storageKey, "light");
  sync(null, null);
  assert.equal(app.root.dataset.theme, "dark");
  assert.deepEqual(app.writes, []);
});

test("unrelated keys and storage areas do not change the theme", () => {
  const app = loadTheme({ saved: "light" });
  app.events.DOMContentLoaded();
  app.events.storage({ storageArea: app.storage, key: "another.preference", newValue: "dark" });
  app.events.storage({ storageArea: {}, key: storageKey, newValue: "dark" });
  assert.equal(app.root.dataset.theme, "light");
});
