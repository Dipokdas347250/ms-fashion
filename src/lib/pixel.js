// Sends a Meta Pixel event if the pixel is loaded (it's off until an admin adds a Pixel ID).
// Pass eventID for events the server also sends (Purchase), so Meta counts them once.
export function track(event, params, eventID) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  if (eventID) window.fbq("track", event, params, { eventID });
  else window.fbq("track", event, params);
}
