import { gsap } from "gsap";
import { CHANNEL_IDS, nextChannel, normalizeTheme, matchesProject, assessEvidence } from "../lib/display.mjs";

function required<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing display element: ${selector}`);
  return element;
}

const root = document.documentElement;
const television = required<HTMLElement>(".television");
const scrollRoot = required<HTMLElement>("[data-scroll-root]");
const screen = required<HTMLElement>("#screen-content");
const controls = required<HTMLElement>("[data-controls]");
const standby = required<HTMLElement>("[data-standby]");
const announcement = required<HTMLElement>("[data-announcement]");
const themeButton = required<HTMLButtonElement>("[data-theme-toggle]");
const crtButton = required<HTMLButtonElement>("[data-crt-toggle]");
const motionButton = required<HTMLButtonElement>("[data-motion-toggle]");
const powerButton = required<HTMLButtonElement>("[data-power-toggle]");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const isHome = television.dataset.home === "true";
const motionTargets = "[data-reveal], .hero-copy > *";
let currentChannel = root.dataset.channel || "signal";
let requestedMotion = root.dataset.motion !== "off";
let powered = true;

function storageError(error: unknown) {
  if (!(error instanceof DOMException) || !["SecurityError", "QuotaExceededError"].includes(error.name)) throw error;
  console.warn("Display preference storage is unavailable; this visit still works.");
  announcement.textContent = "Your display changed, but the browser could not save the preference.";
}

function remember(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch (error) { storageError(error); }
}

function syncTheme(theme: "dark" | "light") {
  root.dataset.theme = theme;
  themeButton.setAttribute("aria-checked", String(theme === "light"));
  required<HTMLElement>("[data-theme-label]").textContent = theme.toUpperCase();
  required<HTMLMetaElement>('meta[name="theme-color"]').content = theme === "light" ? "#F3F2E9" : "#000F13";
}

function syncCrt(on: boolean) {
  root.dataset.crt = on ? "on" : "off";
  crtButton.setAttribute("aria-pressed", String(on));
}

function syncMotion() {
  const on = requestedMotion && !reduced.matches;
  root.dataset.motion = on ? "on" : "off";
  motionButton.disabled = reduced.matches;
  motionButton.setAttribute("aria-pressed", String(on));
  motionButton.title = reduced.matches ? "Animation is off for your reduced-motion preference" : "Toggle decorative motion";
  if (!on) {
    gsap.killTweensOf(motionTargets);
    gsap.set(motionTargets, { clearProps: "opacity,visibility,transform" });
  }
}

syncTheme(normalizeTheme(root.dataset.theme));
syncCrt(root.dataset.crt !== "off");
syncMotion();
root.classList.add("enhanced");
controls.hidden = false;

themeButton.addEventListener("click", () => {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  syncTheme(theme);
  remember("zanark.portfolio.theme", theme);
});
crtButton.addEventListener("click", () => {
  const on = root.dataset.crt !== "on";
  syncCrt(on);
  remember("zanark.signal.crt", on ? "on" : "off");
});
motionButton.addEventListener("click", () => {
  requestedMotion = !requestedMotion;
  syncMotion();
  remember("zanark.signal.motion", requestedMotion ? "on" : "off");
});
reduced.addEventListener("change", syncMotion);
window.addEventListener("storage", (event) => {
  if (event.key === "zanark.portfolio.theme") syncTheme(normalizeTheme(event.newValue));
  if (event.key === "zanark.signal.crt") syncCrt(event.newValue !== "off");
  if (event.key === "zanark.signal.motion") {
    requestedMotion = event.newValue !== "off";
    syncMotion();
  }
  if (event.key === null) {
    syncTheme("dark");
    syncCrt(true);
    requestedMotion = true;
    syncMotion();
  }
});

powerButton.addEventListener("click", () => {
  powered = !powered;
  root.dataset.power = powered ? "on" : "off";
  screen.inert = !powered;
  standby.hidden = powered;
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-channel-step]")) button.disabled = !powered;
  powerButton.setAttribute("aria-pressed", String(powered));
  powerButton.setAttribute("aria-label", powered ? "Turn display off" : "Turn display on");
  announcement.textContent = powered ? "Display on. Your place is preserved." : "Display paused. Use the power button to resume.";
});

function updateChannel(id: string) {
  const index = CHANNEL_IDS.indexOf(id);
  if (index < 0) throw new Error(`Unknown channel: ${id}`);
  currentChannel = id;
  root.dataset.channel = id;
  const link = required<HTMLAnchorElement>(`[data-channel-link="${id}"]`);
  for (const item of document.querySelectorAll<HTMLElement>("[data-channel-link]")) {
    if (item.dataset.channelLink === id) item.setAttribute("aria-current", "location");
    else item.removeAttribute("aria-current");
  }
  const label = link.textContent?.replace(/^\s*\d+\s*/, "").trim() || id;
  required<HTMLElement>("[data-channel-label]").textContent = `CH ${String(index + 1).padStart(2, "0")} / ${label.toUpperCase()}`;
  const navigation = link.parentElement;
  if (navigation) {
    const bounds = navigation.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (item.left < bounds.left) navigation.scrollLeft -= bounds.left - item.left;
    else if (item.right > bounds.right) navigation.scrollLeft += item.right - bounds.right;
  }
}

function tune(id: string, historyEntry = true) {
  if (!powered || !CHANNEL_IDS.includes(id)) return;
  if (!isHome) {
    window.location.assign(`/#${id}`);
    return;
  }
  const section = required<HTMLElement>(`#${id}`);
  const top = scrollRoot.scrollTop + section.getBoundingClientRect().top - scrollRoot.getBoundingClientRect().top;
  scrollRoot.scrollTo({ top, behavior: root.dataset.motion === "on" ? "smooth" : "instant" });
  updateChannel(id);
  announcement.textContent = `${id === "projects" ? "Projects" : id} channel selected.`;
  if (historyEntry && location.hash !== `#${id}`) history.pushState(null, "", `#${id}`);
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-channel-step]")) {
  button.addEventListener("click", () => tune(nextChannel(currentChannel, button.dataset.channelStep === "-1" ? -1 : 1)));
}
if (isHome) {
  for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
    const id = link.hash.slice(1);
    if (!CHANNEL_IDS.includes(id)) continue;
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      tune(id);
    });
  }
  let scrollFrame = 0;
  scrollRoot.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const boundary = scrollRoot.getBoundingClientRect().top + scrollRoot.clientHeight * .32;
      const sections = [...document.querySelectorAll<HTMLElement>(".channel-section")];
      const active = sections.filter((section) => section.getBoundingClientRect().top <= boundary).at(-1);
      if (active && active.id !== currentChannel) updateChannel(active.id);
    });
  }, { passive: true });
  window.addEventListener("hashchange", () => {
    const id = location.hash.slice(1);
    if (CHANNEL_IDS.includes(id)) tune(id, false);
  });
  if (CHANNEL_IDS.includes(location.hash.slice(1))) {
    requestAnimationFrame(() => tune(location.hash.slice(1), false));
  }
}
window.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
  if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable=true], .pixel-board")) return;
  if (/^[1-6]$/.test(event.key)) {
    const channel = CHANNEL_IDS[Number(event.key) - 1];
    if (channel) {
      event.preventDefault();
      tune(channel);
    }
  }
});

if (root.dataset.motion === "on") {
  gsap.from(".hero-copy > *", { y: 12, opacity: 0, duration: .5, stagger: .065, ease: "power2.out", clearProps: "all" });
}
const reveals = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    if (root.dataset.motion === "on") {
      gsap.fromTo(entry.target, { y: 12, opacity: .1 }, { y: 0, opacity: 1, duration: .45, ease: "power2.out", clearProps: "all" });
    }
    reveals.unobserve(entry.target);
  }
}, { root: scrollRoot, threshold: .08 });
for (const node of document.querySelectorAll("[data-reveal]")) reveals.observe(node);

const filters = document.querySelector<HTMLElement>("[data-project-filters]");
if (filters) {
  filters.hidden = false;
  for (const button of filters.querySelectorAll<HTMLButtonElement>("[data-filter]")) {
    button.addEventListener("click", () => {
      const selected = button.dataset.filter || "all";
      for (const option of filters.querySelectorAll<HTMLButtonElement>("[data-filter]")) option.setAttribute("aria-pressed", String(option === button));
      let visible = 0;
      for (const card of document.querySelectorAll<HTMLElement>("[data-project-category]")) {
        card.hidden = !matchesProject(card.dataset.projectCategory, selected);
        if (!card.hidden) visible++;
      }
      required<HTMLElement>("[data-filter-status]").textContent = `Showing ${visible} projects.`;
    });
  }
}

const evidence = [...document.querySelectorAll<HTMLInputElement>("[data-evidence]")];
if (evidence.length) {
  const collected = required<HTMLInputElement>('[data-evidence="collected"]');
  const current = required<HTMLInputElement>('[data-evidence="current"]');
  const compatible = required<HTMLInputElement>('[data-evidence="compatible"]');
  const renderEvidence = () => {
    const result = assessEvidence({ collected: collected.checked, current: current.checked, compatible: compatible.checked });
    required<HTMLElement>("[data-evidence-result]").dataset.state = result.state;
    required<HTMLElement>("[data-evidence-title]").textContent = result.label;
    required<HTMLElement>("[data-evidence-message]").textContent = result.message;
  };
  for (const input of evidence) {
    input.disabled = false;
    input.addEventListener("change", renderEvidence);
  }
}

const pixels = [...document.querySelectorAll<HTMLButtonElement>("[data-pixel]")];
if (pixels.length) {
  const colors: Record<string, string> = { ".": "#001E26", f: "#00A591", w: "#EEE8D5", y: "#EBE565", r: "#E84A5F" };
  const names: Record<string, string> = { ".": "blank", f: "foam", w: "ivory", y: "yellow", r: "rose" };
  const initial = pixels.map((pixel) => pixel.dataset.color || ".");
  let brush = "f";
  required<HTMLElement>("[data-pixel-tools]").hidden = false;
  function paint(pixel: HTMLButtonElement, color: string) {
    if (!(color in colors)) throw new Error("Unknown brush color");
    pixel.dataset.color = color;
    const index = Number(pixel.dataset.pixel);
    pixel.setAttribute("aria-label", `Row ${Math.floor(index / 12) + 1}, column ${index % 12 + 1}: ${names[color]}`);
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>("[data-paint]")) {
    button.addEventListener("click", () => {
      const color = button.dataset.paint;
      if (!color || !(color in colors)) throw new Error("Invalid palette control");
      brush = color;
      for (const item of document.querySelectorAll("[data-paint]")) item.setAttribute("aria-pressed", String(item === button));
    });
  }
  for (const pixel of pixels) {
    pixel.disabled = false;
    pixel.addEventListener("click", () => paint(pixel, brush));
    pixel.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse" && event.buttons === 1) paint(pixel, brush); });
    pixel.addEventListener("focus", () => { for (const item of pixels) item.tabIndex = item === pixel ? 0 : -1; });
    pixel.addEventListener("keydown", (event) => {
      const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -12, ArrowDown: 12 };
      const offset = offsets[event.key];
      if (offset === undefined) return;
      event.preventDefault();
      const index = Number(pixel.dataset.pixel);
      const next = Math.min(pixels.length - 1, Math.max(0, index + offset));
      pixels[next]?.focus();
    });
  }
  required<HTMLButtonElement>("[data-sketch-clear]").addEventListener("click", () => {
    pixels.forEach((pixel) => paint(pixel, "."));
    required<HTMLElement>("[data-sketch-status]").textContent = "Canvas cleared. Your next pixel is a fresh start.";
  });
  required<HTMLButtonElement>("[data-sketch-reset]").addEventListener("click", () => {
    pixels.forEach((pixel, index) => paint(pixel, initial[index] || "."));
    required<HTMLElement>("[data-sketch-status]").textContent = "Original sketch restored.";
  });
  required<HTMLButtonElement>("[data-sketch-save]").addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = 384;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) {
      required<HTMLElement>("[data-sketch-status]").textContent = "This browser cannot export the canvas.";
      return;
    }
    pixels.forEach((pixel, index) => {
      context.fillStyle = colors[pixel.dataset.color || "."] || colors["."];
      context.fillRect((index % 12) * 32, Math.floor(index / 12) * 32, 32, 32);
    });
    canvas.toBlob((blob) => {
      if (!blob) {
        required<HTMLElement>("[data-sketch-status]").textContent = "PNG export failed. Your sketch is still here.";
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "zanark-signal-sketch.png";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      required<HTMLElement>("[data-sketch-status]").textContent = "PNG created locally. Nothing was uploaded.";
    }, "image/png");
  });
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-print]")) {
  button.hidden = false;
  button.addEventListener("click", () => window.print());
}
