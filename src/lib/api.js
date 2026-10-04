import { PRODUCTS, SINGLE_PRICE, SIZES, YOUTUBE_URL } from "@/lib/products";

// Express backend (server/). Only used on the server, so the browser never sees it.
export const API_URL = process.env.API_URL || "http://localhost:5000";

// Built-in list, used only when the API can't be reached so the page still works.
const FALLBACK = PRODUCTS.map((p) => ({
  ...p,
  price: SINGLE_PRICE,
  sizes: Object.fromEntries(SIZES.map((s) => [s, true])),
}));

// Visible YouTube videos from the dashboard (Videos page), in display order: [{ id, title, url }].
// An empty list means the admin hid them all; the built-in video is used only when the API is down.
export async function getVideos() {
  try {
    const res = await fetch(`${API_URL}/api/videos`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(4000),
    });
    const json = await res.json();
    if (!res.ok || !Array.isArray(json.data)) throw new Error(json.error || `HTTP ${res.status}`);
    return json.data.map((v) => ({ id: v._id, title: v.title, url: v.url }));
  } catch (err) {
    console.error("Videos API unreachable, using the built-in video:", err.message);
    return YOUTUBE_URL ? [{ id: "default", title: "", url: YOUTUBE_URL }] : [];
  }
}

// Visible products from the dashboard, refreshed every 30 seconds.
// Shape: { id, name, color, price, image, position, sizes: { M: inStock, … } }
export async function getProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(4000),
    });
    const json = await res.json();
    if (!res.ok || !Array.isArray(json.data)) throw new Error(json.error || `HTTP ${res.status}`);

    const local = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
    return json.data.map((p) => ({
      id: p.slug,
      name: p.name,
      color: p.color,
      price: p.price,
      // "/uploads/…" is forwarded to the API by next.config.mjs; no upload → the bundled photo, if any.
      image: p.images?.[0] || local[p.slug]?.image || null,
      position: p.imagePosition || local[p.slug]?.position,
      sizes: Object.fromEntries(SIZES.map((s) => [s, p.variants?.find((v) => v.size === s)?.inStock ?? false])),
    }));
  } catch (err) {
    console.error("Products API unreachable, using the built-in list:", err.message);
    return FALLBACK;
  }
}
