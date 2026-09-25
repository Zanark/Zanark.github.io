export const CHANNEL_IDS = ["signal", "work", "projects", "story", "lab", "contact"];

/** @param {string} current @param {-1 | 1} direction */
export function nextChannel(current, direction) {
  const index = Math.max(0, CHANNEL_IDS.indexOf(current));
  return CHANNEL_IDS[(index + direction + CHANNEL_IDS.length) % CHANNEL_IDS.length];
}

/** @param {unknown} value */
export function normalizeTheme(value) {
  return value === "light" ? "light" : "dark";
}

/** @param {{collected: boolean, current: boolean, compatible: boolean}} evidence */
export function assessEvidence({ collected, current, compatible }) {
  if (!collected) return { state: "unknown", label: "Not enough evidence", message: "A missing observation is not a failed system, and it is not a ready system." };
  if (!current) return { state: "stale", label: "Refresh the observation", message: "A complete observation from the wrong moment cannot approve today's plan." };
  if (!compatible) return { state: "blocked", label: "Constraint not satisfied", message: "The observed option does not satisfy the selected requirement. Review alternatives." };
  return { state: "review", label: "Ready for human review", message: "The checks support a review. They do not automatically authorize a deployment." };
}

/** @param {string | undefined} category @param {string} selected */
export function matchesProject(category, selected) {
  return selected === "all" || category === selected;
}
