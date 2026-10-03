import { COMBO_SIZE, DELIVERY, PRODUCTS, SIZES, bn } from "@/lib/products";

// Express backend (server/). Server-only, so the browser never sees it.
const API_URL = process.env.API_URL || "http://localhost:5000";

const productIds = new Set(PRODUCTS.map((p) => p.id));
const SERVER_ERROR = "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "অনুরোধটি সঠিক নয়।" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  const address = String(body.address ?? "").trim();
  const { area, items } = body;

  if (!name || !address) {
    return Response.json({ error: "অনুগ্রহ করে নাম ও ঠিকানা লিখুন।" }, { status: 400 });
  }
  if (!/^01[3-9]\d{8}$/.test(phone)) {
    return Response.json({ error: "অনুগ্রহ করে সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।" }, { status: 400 });
  }
  if (!DELIVERY[area]) {
    return Response.json({ error: "অনুগ্রহ করে ডেলিভারি এলাকা বাছুন।" }, { status: 400 });
  }
  if (
    !Array.isArray(items) ||
    items.length !== COMBO_SIZE ||
    !items.every((it) => productIds.has(it?.productId) && SIZES.includes(it?.size))
  ) {
    return Response.json({ error: `সাইজসহ ${bn(COMBO_SIZE)}টি টি-শার্ট বাছুন।` }, { status: 400 });
  }

  // The backend re-validates everything and calculates the real total from its own prices.
  const headers = { "Content-Type": "application/json" };
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (clientIp) headers["X-Forwarded-For"] = clientIp; // so rate limiting is per customer

  let res, data;
  try {
    res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, phone, address, area, items }),
      signal: AbortSignal.timeout(20000),
    });
    data = await res.json();
  } catch (err) {
    console.error("Order API unreachable:", err);
    return Response.json({ error: SERVER_ERROR }, { status: 502 });
  }

  if (!res.ok || !data.success) {
    return Response.json({ error: data.error || SERVER_ERROR }, { status: res.status >= 400 ? res.status : 502 });
  }
  return Response.json({ orderId: data.data.orderId, total: data.data.total });
}
