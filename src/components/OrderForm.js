"use client";

import Image from "next/image";
import { useState } from "react";
import {
  COMBO_PRICE,
  COMBO_SIZE,
  DELIVERY,
  PRODUCTS,
  SINGLE_PRICE,
  SIZES,
  taka,
} from "@/lib/products";

const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export default function OrderForm() {
  const [items, setItems] = useState([]);
  const [area, setArea] = useState("inside");
  const [status, setStatus] = useState({ state: "idle" });

  const full = items.length === COMBO_SIZE;
  const delivery = DELIVERY[area].fee;
  const total = COMBO_PRICE + delivery;

  function add(productId) {
    if (full) return;
    setItems((prev) => [...prev, { productId, size: "L" }]);
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
      setStatus({ state: "error", message: `Please choose ${COMBO_SIZE} T-shirts first.` });
      return;
    }
    const form = new FormData(e.currentTarget);
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
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
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
        <h3 className="mt-5 font-display text-4xl tracking-wide">Order Confirmed!</h3>
        <p className="mt-2 text-neutral-600">
          Thank you. Our team will call you shortly to confirm your order.
        </p>
        <div className="mx-auto mt-6 max-w-xs rounded-xl bg-neutral-100 p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-500">Order ID</span>
            <span className="font-semibold">{status.orderId}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-neutral-500">Pay on delivery</span>
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
            1
          </span>
          Choose any {COMBO_SIZE} T-shirts
          <span className="ml-auto rounded-full bg-gold/15 px-3 py-1 text-sm font-semibold text-gold-dark">
            {items.length}/{COMBO_SIZE}
          </span>
        </h3>
        <p className="mt-1 pl-11 text-sm text-neutral-500">
          Tap a design to add it. You can pick the same design more than once.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PRODUCTS.map((p) => {
            const count = items.filter((it) => it.productId === p.id).length;
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => add(p.id)}
                disabled={full}
                className={`group relative overflow-hidden rounded-xl border-2 bg-white text-left transition ${
                  count ? "border-black" : "border-neutral-200 hover:border-neutral-400"
                } disabled:cursor-not-allowed ${full && !count ? "opacity-50" : ""}`}
              >
                <div className="relative aspect-square bg-neutral-100">
                  <Image
                    src={p.image}
                    alt={`${p.name} — ${p.color}`}
                    fill
                    sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                    style={{ objectPosition: p.position ?? "center" }}
                  />
                  {count > 0 && (
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-gold">
                      ×{count}
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
                  T-shirt {i + 1} — not selected yet
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
                  <Image
                    src={p.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                    style={{ objectPosition: p.position ?? "center" }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-neutral-500">{p.color}</div>
                </div>
                <div className="flex gap-1" role="radiogroup" aria-label={`Size for T-shirt ${i + 1}`}>
                  {SIZES.map((s) => (
                    <button
                      type="button"
                      key={s}
                      role="radio"
                      aria-checked={it.size === s}
                      onClick={() => setSize(i, s)}
                      className={`h-9 min-w-10 rounded-md px-2 text-xs font-bold transition ${
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
                  aria-label="Remove"
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
              2
            </span>
            Delivery details
          </h3>

          <div className="mt-4 space-y-3">
            <Field label="Your name" name="name" placeholder="Full name" autoComplete="name" />
            <Field
              label="Mobile number"
              name="phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              inputMode="numeric"
              pattern="01[3-9][0-9]{8}"
              title="11-digit Bangladeshi mobile number, e.g. 01712345678"
              autoComplete="tel"
            />
            <label className="block">
              <span className="text-sm font-medium">Full address</span>
              <textarea
                name="address"
                required
                rows={2}
                placeholder="House, road, area, district"
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2.5 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>

            <fieldset>
              <legend className="text-sm font-medium">Delivery area</legend>
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
            <Row label={`${COMBO_SIZE} T-shirts (regular)`}>
              <span className="text-neutral-400 line-through">{taka(SINGLE_PRICE * COMBO_SIZE)}</span>
            </Row>
            <Row label="Combo offer price">{taka(COMBO_PRICE)}</Row>
            <Row label="Delivery charge">{taka(delivery)}</Row>
            <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-base font-bold">
              <span>Total</span>
              <span className="font-display text-3xl tracking-wide">{taka(total)}</span>
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
              ? "Placing order…"
              : full
                ? `Confirm Order — ${taka(total)}`
                : `Select ${COMBO_SIZE - items.length} more T-shirt${COMBO_SIZE - items.length > 1 ? "s" : ""}`}
          </button>
          <p className="mt-2 text-center text-xs text-neutral-500">
            💵 Cash on delivery — pay after you receive the parcel
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
