"use client";

import Image from "next/image";
import { useState } from "react";
import { DELIVERY, SIZES, taka } from "@/lib/products";
import { track } from "@/lib/pixel";

// Uploaded photos ("/uploads/…", served by the API) skip Next's optimizer; bundled imports use it.
function ProductImage({ product, alt, ...props }) {
  if (!product.image) {
    return <div className="flex h-full w-full items-center justify-center text-3xl text-neutral-300">👕</div>;
  }
  return (
    <Image
      src={product.image}
      alt={alt}
      unoptimized={typeof product.image === "string"}
      style={{ objectPosition: product.position ?? "center" }}
      fill
      {...props}
    />
  );
}

// `product` comes from the API (see lib/api.js): { id, name, color, price, image, position, sizes }.
// One product, one unit. The customer picks the size; it starts on L, or the first one in stock.
export default function OrderForm({ product }) {
  const [area, setArea] = useState("inside");
  const [status, setStatus] = useState({ state: "idle" });
  const [picked, setPicked] = useState(null);

  const inStock = product ? SIZES.filter((s) => product.sizes[s]) : [];
  const size = inStock.includes(picked) ? picked : inStock.includes("L") ? "L" : inStock[0];
  const price = product?.price || 0;
  const delivery = DELIVERY[area].fee;
  const total = price + delivery;

  async function submit(e) {
    e.preventDefault();
    if (!size) {
      setStatus({ state: "error", message: "দুঃখিত, পণ্যটি এখন স্টকে নেই।" });
      return;
    }
    const form = new FormData(e.currentTarget);
    const contentIds = [product.id];
    track("InitiateCheckout", { content_ids: contentIds, content_type: "product", currency: "BDT", value: total, num_items: 1 });
    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          address: form.get("address"),
          area,
          items: [{ productId: product.id, size }],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      // Same event ID as the server's Conversions API event, so Meta counts the sale once.
      track(
        "Purchase",
        { content_ids: contentIds, content_type: "product", currency: "BDT", value: data.total, num_items: 1 },
        data.orderId,
      );
      setStatus({ state: "done", orderId: data.orderId, total: data.total });
    } catch (err) {
      setStatus({ state: "error", message: err.message });
    }
  }

  if (status.state === "done") {
    return (
      <div className="rounded-2xl border-2 border-black bg-white p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-3xl text-gold">
          ✓
        </div>
        <h3 className="mt-5 font-display text-4xl">অর্ডার সম্পন্ন হয়েছে!</h3>
        <p className="mt-2 text-neutral-600">
          ধন্যবাদ! অর্ডার কনফার্ম করতে আমাদের টিম খুব শিগগিরই আপনাকে কল করবে।
        </p>
        <div className="mx-auto mt-6 max-w-xs rounded-xl bg-neutral-100 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">অর্ডার আইডি</span>
            <span className="font-semibold">{status.orderId}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-neutral-500">ডেলিভারির সময় পরিশোধ</span>
            <span className="font-semibold">{taka(status.total)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
      {/* The product */}
      {product && (
        <div className="self-start overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200">
          <div className="relative aspect-square bg-neutral-100">
            <ProductImage
              product={product}
              alt={`${product.name} — ${product.color}`}
              sizes="(min-width: 768px) 450px, 100vw"
              className="object-cover"
            />
            {!size && (
              <span className="absolute inset-x-0 bottom-0 bg-black/70 py-2 text-center text-sm font-bold text-white">
                স্টক শেষ
              </span>
            )}
          </div>
          <div className="flex items-end justify-between gap-3 p-4">
            <div>
              <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
              <p className="text-sm text-neutral-500">{product.color}</p>
            </div>
            <div className="font-display text-3xl">{taka(price)}</div>
          </div>
        </div>
      )}

      {/* Delivery details & summary */}
      <div className="md:sticky md:top-6 md:self-start">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 sm:p-6">
          <h3 className="text-lg font-bold">ডেলিভারির তথ্য</h3>

          <div className="mt-4 space-y-3">
            {product && (
              <fieldset>
                <legend className="text-sm font-medium">সাইজ বাছুন</legend>
                <div className="mt-1 grid grid-cols-4 gap-2">
                  {SIZES.map((s) => {
                    const available = Boolean(product.sizes[s]);
                    return (
                      <label
                        key={s}
                        className={`relative rounded-lg border-2 py-2.5 text-center text-sm font-bold transition ${
                          !available
                            ? "cursor-not-allowed border-neutral-200 text-neutral-300 line-through"
                            : size === s
                              ? "cursor-pointer border-black bg-black text-white"
                              : "cursor-pointer border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="size"
                          value={s}
                          checked={size === s}
                          disabled={!available}
                          onChange={() => setPicked(s)}
                          className="sr-only"
                        />
                        {s}
                      </label>
                    );
                  })}
                </div>
                {inStock.length > 0 && inStock.length < SIZES.length && (
                  <p className="mt-1 text-xs text-neutral-500">কাটা দাগ দেওয়া সাইজগুলো এখন স্টকে নেই।</p>
                )}
              </fieldset>
            )}
            <Field label="আপনার নাম" name="name" placeholder="পূর্ণ নাম লিখুন" autoComplete="name" />
            <Field
              label="মোবাইল নম্বর"
              name="phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              inputMode="numeric"
              pattern="01[3-9][0-9]{8}"
              title="১১ সংখ্যার মোবাইল নম্বর দিন, যেমন: 01712345678"
              autoComplete="tel"
            />
            <label className="block">
              <span className="text-sm font-medium">সম্পূর্ণ ঠিকানা</span>
              <textarea
                name="address"
                required
                rows={2}
                placeholder="বাসা, রোড, এলাকা, থানা, জেলা"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>

            <fieldset>
              <legend className="text-sm font-medium">ডেলিভারি এলাকা</legend>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {Object.entries(DELIVERY).map(([key, d]) => (
                  <label
                    key={key}
                    className={`cursor-pointer rounded-lg border-2 px-3 py-2.5 text-sm transition ${
                      area === key ? "border-black bg-neutral-50" : "border-neutral-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="area"
                      value={key}
                      checked={area === key}
                      onChange={() => setArea(key)}
                      className="sr-only"
                    />
                    <div className="font-semibold">{d.label}</div>
                    <div className="text-neutral-500">{taka(d.fee)}</div>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-5 space-y-2 border-t border-dashed border-neutral-300 pt-4 text-sm">
            {size && <Row label="সাইজ">{size}</Row>}
            <Row label="পণ্যের মূল্য">{taka(price)}</Row>
            <Row label="ডেলিভারি চার্জ">{taka(delivery)}</Row>
            <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-base font-bold">
              <span>সর্বমোট</span>
              <span className="font-display text-3xl">{taka(total)}</span>
            </div>
          </div>

          {status.state === "error" && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{status.message}</p>
          )}

          <button
            type="submit"
            disabled={status.state === "sending" || !size}
            className="mt-4 w-full rounded-xl bg-black py-4 text-lg font-bold text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {status.state === "sending" ? "অর্ডার হচ্ছে…" : size ? `অর্ডার কনফার্ম করুন — ${taka(total)}` : "স্টক শেষ"}
          </button>
          <p className="mt-2 text-center text-xs text-neutral-500">
            💵 ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে টাকা দিন
          </p>
        </div>
      </div>
    </form>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        required
        {...props}
        className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
      />
    </label>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between">
      <span className="text-neutral-600">{label}</span>
      <span className="font-semibold">{children}</span>
    </div>
  );
}
