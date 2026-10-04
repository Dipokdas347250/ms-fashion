"use client";

import Image from "next/image";
import { useState } from "react";
import {
  COMBO_PRICE,
  COMBO_SIZE,
  DELIVERY,
  SIZES,
  bn,
  taka,
} from "@/lib/products";
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

// `products` come from the API (see lib/api.js): { id, name, color, price, image, position, sizes }.
export default function OrderForm({ products }) {
  const [items, setItems] = useState([]);
  const [area, setArea] = useState("inside");
  const [status, setStatus] = useState({ state: "idle" });

  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const full = items.length === COMBO_SIZE;
  const delivery = DELIVERY[area].fee;
  // Same rule as the server: any 3 for the combo price, unless the shirts add up to less.
  const regular = full
    ? items.reduce((s, it) => s + (byId[it.productId]?.price || 0), 0)
    : Math.max(0, ...products.map((p) => p.price)) * COMBO_SIZE;
  const comboPrice = Math.min(COMBO_PRICE, regular);
  const total = comboPrice + delivery;

  function add(productId) {
    const p = byId[productId];
    const size = p.sizes.L ? "L" : SIZES.find((s) => p.sizes[s]);
    if (full || !size) return;
    setItems((prev) => [...prev, { productId, size }]);
    track("AddToCart", { content_ids: [productId], content_type: "product", currency: "BDT", value: p.price });
  }

  function setSize(index, size) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, size } : it)));
  }

  function remove(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit(e) {
    e.preventDefault();
    if (!full) {
      setStatus({ state: "error", message: `আগে ${bn(COMBO_SIZE)}টি টি-শার্ট বেছে নিন।` });
      return;
    }
    const form = new FormData(e.currentTarget);
    const contentIds = [...new Set(items.map((it) => it.productId))];
    track("InitiateCheckout", { content_ids: contentIds, content_type: "product", currency: "BDT", value: total, num_items: COMBO_SIZE });
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
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      // Same event ID as the server's Conversions API event, so Meta counts the sale once.
      track(
        "Purchase",
        { content_ids: contentIds, content_type: "product", currency: "BDT", value: data.total, num_items: COMBO_SIZE },
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
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      {/* Step 1 — pick designs */}
      <div>
        <h3 className="flex items-center gap-3 text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm text-white">
            ১
          </span>
          যেকোনো {bn(COMBO_SIZE)}টি টি-শার্ট বাছুন
          <span className="ml-auto rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold-dark">
            {bn(items.length)}/{bn(COMBO_SIZE)}
          </span>
        </h3>
        <p className="mt-1 pl-11 text-sm text-neutral-500">
          ডিজাইনে ট্যাপ করে যোগ করুন। একই ডিজাইন একাধিকবারও নিতে পারেন।
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {products.map((p) => {
            const count = items.filter((it) => it.productId === p.id).length;
            const soldOut = !SIZES.some((s) => p.sizes[s]);
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => add(p.id)}
                disabled={full || soldOut}
                className={`group relative overflow-hidden rounded-xl border-2 bg-white text-left transition ${
                  count ? "border-black" : "border-neutral-200 hover:border-neutral-400"
                } disabled:cursor-not-allowed ${(full && !count) || soldOut ? "opacity-50" : ""}`}
              >
                <div className="relative aspect-square bg-neutral-100">
                  <ProductImage
                    product={p}
                    alt={`${p.name} — ${p.color}`}
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  {soldOut && (
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center text-xs font-bold text-white">
                      স্টক শেষ
                    </span>
                  )}
                  {count > 0 && (
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-gold">
                      ×{bn(count)}
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <div className="text-sm font-semibold leading-tight">{p.name}</div>
                  <div className="text-xs text-neutral-500">{p.color}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected slots with size pickers */}
        <div className="mt-5 space-y-2">
          {Array.from({ length: COMBO_SIZE }, (_, i) => {
            const it = items[i];
            if (!it) {
              return (
                <div
                  key={i}
                  className="flex h-16 items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 text-sm text-neutral-400"
                >
                  টি-শার্ট {bn(i + 1)} — এখনো বাছাই করা হয়নি
                </div>
              );
            }
            const p = byId[it.productId];
            return (
              <div
                key={i}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white p-2"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <ProductImage product={p} alt="" sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-neutral-500">{p.color}</div>
                </div>
                <div className="flex gap-1" role="radiogroup" aria-label={`টি-শার্ট ${bn(i + 1)}-এর সাইজ`}>
                  {SIZES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      role="radio"
                      aria-checked={it.size === s}
                      disabled={!p.sizes[s]}
                      title={p.sizes[s] ? undefined : "এই সাইজ স্টকে নেই"}
                      onClick={() => setSize(i, s)}
                      className={`h-9 min-w-10 rounded-md px-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:text-neutral-300 disabled:line-through ${
                        it.size === s
                          ? "bg-black text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  aria-label="বাদ দিন"
                  className="h-9 w-9 rounded-md text-lg text-neutral-400 hover:bg-red-50 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2 — delivery details & summary */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 sm:p-6">
          <h3 className="flex items-center gap-3 text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm text-white">
              ২
            </span>
            ডেলিভারির তথ্য
          </h3>

          <div className="mt-4 space-y-3">
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
            <Row label={`${bn(COMBO_SIZE)}টি টি-শার্ট (নিয়মিত দাম)`}>
              <span className="text-neutral-400 line-through">{taka(regular)}</span>
            </Row>
            <Row label="কম্বো অফার মূল্য">{taka(comboPrice)}</Row>
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
            disabled={status.state === "sending"}
            className="mt-4 w-full rounded-xl bg-black py-4 text-lg font-bold text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {status.state === "sending"
              ? "অর্ডার হচ্ছে…"
              : full
                ? `অর্ডার কনফার্ম করুন — ${taka(total)}`
                : `আরও ${bn(COMBO_SIZE - items.length)}টি টি-শার্ট বাছুন`}
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
