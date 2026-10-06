import { cookies } from "next/headers";
import { API_URL } from "@/lib/api";
import { DELIVERY, SIZES } from "@/lib/products";

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
    items.length !== 1 ||
    // The API checks that the product exists, is visible and the size is in stock.
    !items.every((it) => typeof it?.productId === "string" && it.productId && SIZES.includes(it?.size))
  ) {
    return Response.json({ error: "অর্ডারটি সঠিক নয়, পেজটি রিফ্রেশ করে আবার চেষ্টা করুন।" }, { status: 400 });
  }

  // The backend re-validates everything and calculates the real total from its own prices.
  const headers = { "Content-Type": "application/json" };
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  if (clientIp) headers["X-Forwarded-For"] = clientIp; // so rate limiting is per customer

  // Browser details for the Meta Conversions API (the _fbp/_fbc cookies are set by the pixel).
  const cookieStore = await cookies();
  const tracking = {
    fbp: cookieStore.get("_fbp")?.value,
    fbc: cookieStore.get("_fbc")?.value,
    userAgent: request.headers.get("user-agent")?.slice(0, 500) || undefined,
    sourceUrl: request.headers.get("referer")?.slice(0, 500) || undefined,
  };

  let res, data;
  try {
    res = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name, phone, address, area, items, tracking }),
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
