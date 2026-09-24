(() => {
  const storageKey = "zanark.portfolio.theme";
  const root = document.documentElement;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const normalize = (value) => value === "light" ? "light" : "dark";
  let storage = null;
  let theme = "dark";
  let toggle;
  let label;

  function reportStorageError(error) {
    if (!(error instanceof DOMException) ||
        !["SecurityError", "QuotaExceededError"].includes(error.name)) {
      throw error;
    }
    console.warn("Theme preference storage is unavailable; changes may not persist after this page.");
  }

  try {
    storage = window.localStorage;
    theme = normalize(storage.getItem(storageKey));
  } catch (error) {
    storage = null;
    reportStorageError(error);
  }

  function applyTheme(nextTheme) {
    theme = nextTheme;
    root.dataset.theme = theme;
    themeColor.setAttribute("content", theme === "light" ? "#F3F2E9" : "#000F13");
    if (toggle) {
      toggle.setAttribute("aria-checked", String(theme === "light"));
      toggle.title = `Switch to ${theme === "light" ? "dark" : "light"} theme`;
      label.textContent = theme === "light" ? "Light" : "Dark";
    }
  }

  // Apply a saved choice before styles or page content can paint.
  applyTheme(theme);

  document.addEventListener("DOMContentLoaded", () => {
    toggle = document.querySelector("[data-theme-toggle]");
    label = document.querySelector("[data-theme-label]");
    if (!toggle || !label) {
      throw new Error("The theme switch and its label are required.");
    }
    applyTheme(theme);

    toggle.addEventListener("click", () => {
      applyTheme(theme === "dark" ? "light" : "dark");
      if (storage) {
        try {
          storage.setItem(storageKey, theme);
        } catch (error) {
          reportStorageError(error);
        }
      }
    });

    window.addEventListener("storage", (event) => {
      if (storage && event.storageArea === storage &&
          (event.key === storageKey || event.key === null)) {
        applyTheme(normalize(event.newValue));
      }
    });

    toggle.hidden = false;
    root.dataset.themeReady = "";
  }, { once: true });
})();
