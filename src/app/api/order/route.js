import { COMBO_PRICE, COMBO_SIZE, DELIVERY, PRODUCTS, SIZES } from "@/lib/products";

const productIds = new Set(PRODUCTS.map((p) => p.id));

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  const address = String(body.address ?? "").trim();
  const { area, items } = body;

  if (!name || !address) {
    return Response.json({ error: "Please enter your name and address." }, { status: 400 });
  }
  if (!/^01[3-9]\d{8}$/.test(phone)) {
    return Response.json({ error: "Please enter a valid 11-digit mobile number." }, { status: 400 });
  }
  if (!DELIVERY[area]) {
    return Response.json({ error: "Please choose a delivery area." }, { status: 400 });
  }
  if (
    !Array.isArray(items) ||
    items.length !== COMBO_SIZE ||
    !items.every((it) => productIds.has(it?.productId) && SIZES.includes(it?.size))
  ) {
    return Response.json({ error: `Please choose ${COMBO_SIZE} T-shirts with sizes.` }, { status: 400 });
  }

  const total = COMBO_PRICE + DELIVERY[area].fee;
  const orderId = `MS-${Date.now().toString(36).toUpperCase()}`;

  // TODO: save the order (Google Sheet, database, courier API, email…).
  console.log("New order", { orderId, name, phone, address, area, items, total });

  return Response.json({ orderId, total });
}
