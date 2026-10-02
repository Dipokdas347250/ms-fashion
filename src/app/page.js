import Image from "next/image";
import banner from "@/assets/banner.jpg";
import sizeChart from "@/assets/size-chart.jpg";
import solidPack from "@/assets/solid-pack.jpg";
import Countdown from "@/components/Countdown";
import OrderForm from "@/components/OrderForm";
import {
  COMBO_PRICE,
  COMBO_SIZE,
  DELIVERY,
  PRODUCTS,
  SINGLE_PRICE,
  SIZES,
  taka,
} from "@/lib/products";

const REGULAR = SINGLE_PRICE * COMBO_SIZE;
const SAVE = REGULAR - COMBO_PRICE;

const FEATURES = [
  { icon: "👕", title: "Premium Quality", text: "100% soft combed cotton that keeps its shape wash after wash." },
  { icon: "🔥", title: "Trendy Collection", text: "Fresh prints and everyday solid colours for every mood." },
  { icon: "🚚", title: "Fast Delivery", text: "Delivered all over Bangladesh within 1–3 working days." },
  { icon: "💵", title: "Cash on Delivery", text: "No advance payment. Check the parcel, then pay." },
];

const SIZE_ROWS = [
  ["M", 38, 27],
  ["L", 40, 28],
  ["XL", 42, 29],
  ["XXL", 44, 30],
];

const FAQS = [
  {
    q: "Can I mix different designs in one combo?",
    a: `Yes. Pick any ${COMBO_SIZE} T-shirts — the same design, or all different — and choose a size for each.`,
  },
  {
    q: "How do I pay?",
    a: "Cash on delivery. You pay the delivery person after you receive and check your parcel.",
  },
  {
    q: "How long does delivery take?",
    a: "Inside Dhaka 1–2 days, outside Dhaka 2–3 working days.",
  },
  {
    q: "What if the size doesn't fit?",
    a: "Tell the delivery person or call us within 3 days and we'll exchange the size. Only the delivery charge applies.",
  },
];

export default function Home() {
  return (
    <>
      {/* Announcement bar */}
      <div className="bg-black px-4 py-2 text-center text-xs font-medium tracking-wide text-white sm:text-sm">
        <span className="text-gold">★</span> Cash on Delivery all over Bangladesh · Exchange facility available{" "}
        <span className="text-gold">★</span>
      </div>

      {/* Banner */}
      <header className="bg-white">
        <Image
          src={banner}
          alt="MS Fashion & Garments — Style meets comfort"
          priority
          sizes="100vw"
          className="h-auto w-full"
        />
      </header>

      <main className="flex-1">
        {/* Offer hero */}
        <section className="relative overflow-hidden bg-black text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
            <div>
              <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Combo Offer
              </span>
              <h1 className="mt-5 font-display text-6xl leading-[0.9] tracking-wide sm:text-7xl lg:text-8xl">
                Any {COMBO_SIZE} T-Shirts
                <br />
                <span className="text-gold">Only {taka(COMBO_PRICE)}</span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-neutral-300">
                Mix &amp; match from our premium cotton collection. Regular price{" "}
                <span className="line-through">{taka(REGULAR)}</span> — you save{" "}
                <strong className="text-white">{taka(SAVE)}</strong> today.
              </p>

              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-neutral-400">
                  Offer ends tonight
                </p>
                <Countdown />
              </div>

              <a
                href="#order"
                className="mt-9 inline-flex items-center gap-3 rounded-xl bg-gold px-8 py-4 text-lg font-bold text-black transition hover:bg-gold-light"
              >
                Order Now <span aria-hidden>→</span>
              </a>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-gold/20 blur-3xl" aria-hidden />
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10">
                <Image src={solidPack} alt="Three folded T-shirts in maroon, sage and navy" sizes="(min-width: 768px) 50vw, 100vw" />
              </div>
              <div className="absolute -bottom-5 -left-3 -rotate-6 rounded-2xl bg-white px-5 py-3 text-black shadow-xl sm:-left-6">
                <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500">You save</div>
                <div className="font-display text-4xl leading-none">{taka(SAVE)}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-neutral-200 bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-neutral-200 md:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white px-4 py-8 text-center sm:px-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-neutral-500">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Collection */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <SectionHeading eyebrow="The Collection" title="Pick your favourites" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="group overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200">
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={p.image}
                    alt={`${p.name} T-shirt in ${p.color}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    style={{ objectPosition: p.position ?? "center" }}
                  />
                </div>
                <div className="flex items-end justify-between gap-2 p-4">
                  <div>
                    <h3 className="font-semibold leading-tight">{p.name}</h3>
                    <p className="text-sm text-neutral-500">{p.color}</p>
                  </div>
                  <p className="text-xs text-neutral-400">{SIZES.join(" · ")}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="#order"
              className="inline-flex rounded-xl bg-black px-8 py-4 font-bold text-white transition hover:bg-neutral-800"
            >
              Choose any {COMBO_SIZE} for {taka(COMBO_PRICE)}
            </a>
          </div>
        </section>

        {/* Size chart */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl ring-1 ring-neutral-200">
              <Image src={sizeChart} alt="T-shirt size chart" sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div>
              <SectionHeading eyebrow="Find your fit" title="Size Chart" align="left" />
              <table className="mt-8 w-full overflow-hidden rounded-xl text-center ring-1 ring-neutral-200">
                <thead className="bg-black text-sm uppercase tracking-wider text-white">
                  <tr>
                    <th className="py-3">Size</th>
                    <th className="py-3">Chest</th>
                    <th className="py-3">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_ROWS.map(([s, chest, length]) => (
                    <tr key={s} className="border-t border-neutral-200 even:bg-neutral-50">
                      <td className="py-3 font-display text-2xl tracking-wide">{s}</td>
                      <td className="py-3 font-semibold">{chest}&Prime;</td>
                      <td className="py-3 font-semibold">{length}&Prime;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 text-sm text-neutral-500">
                All measurements in inches. Allow 1–2&Prime; variation due to manual measurement.
              </p>
            </div>
          </div>
        </section>

        {/* Order */}
        <section id="order" className="scroll-mt-4 bg-neutral-100 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow={`${COMBO_SIZE} T-shirts · ${taka(COMBO_PRICE)}`}
              title="Place your order"
            />
            <p className="mx-auto mt-3 max-w-lg text-center text-neutral-600">
              Fill in the form below — no advance payment needed. We&apos;ll call to confirm before shipping.
            </p>
            <div className="mt-10">
              <OrderForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16 md:py-20">
          <SectionHeading eyebrow="Questions" title="Good to know" />
          <div className="mt-8 divide-y divide-neutral-200 rounded-2xl bg-white ring-1 ring-neutral-200">
            {FAQS.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="text-xl text-neutral-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-neutral-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-black px-4 pb-24 pt-10 text-center text-sm text-neutral-400 md:pb-10">
        <div className="font-display text-3xl tracking-wider text-white">
          MS <span className="text-gold">Fashion</span> &amp; Garments
        </div>
        <p className="mt-1 uppercase tracking-[0.3em]">Style meets comfort</p>
        <p className="mt-6">
          Delivery: {DELIVERY.inside.label} {taka(DELIVERY.inside.fee)} · {DELIVERY.outside.label}{" "}
          {taka(DELIVERY.outside.fee)}
        </p>
        <p className="mt-2">© {new Date().getFullYear()} MS Fashion &amp; Garments. All rights reserved.</p>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="leading-tight">
          <div className="text-xs text-neutral-500 line-through">{taka(REGULAR)}</div>
          <div className="font-display text-2xl tracking-wide">{taka(COMBO_PRICE)}</div>
        </div>
        <a href="#order" className="flex-1 rounded-xl bg-black py-3 text-center font-bold text-white">
          Order {COMBO_SIZE} T-Shirts
        </a>
      </div>
    </>
  );
}

function SectionHeading({ eyebrow, title, align = "center" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-dark">{eyebrow}</p>
      <h2 className="mt-2 font-display text-5xl tracking-wide md:text-6xl">{title}</h2>
    </div>
  );
}
