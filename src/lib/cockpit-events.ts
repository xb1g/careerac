export const COCKPIT_REFRESH_EVENT = "careerac:cockpit-refresh";
export const COCKPIT_REFRESH_STORAGE_KEY = "careerac:cockpit-refresh-ts";

export function notifyCockpitRefresh() {
  if (typeof window === "undefined") return;

  const timestamp = new Date().toISOString();

  try {
    window.localStorage.setItem(COCKPIT_REFRESH_STORAGE_KEY, timestamp);
  } catch {
    // Ignore storage errors in private/incognito contexts.
  }

  window.dispatchEvent(new CustomEvent(COCKPIT_REFRESH_EVENT, { detail: { timestamp } }));
}
