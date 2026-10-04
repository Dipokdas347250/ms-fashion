import Image from "next/image";
import royalBlue from "@/assets/new2.jpg";
import solidPack from "@/assets/solid-pack.jpg";
import Countdown from "@/components/Countdown";
import OrderForm from "@/components/OrderForm";
import YouTubeVideo from "@/components/YouTubeVideo";
import { getProducts, getVideos } from "@/lib/api";
import {
  COMBO_PRICE,
  COMBO_SIZE,
  DELIVERY,
  SINGLE_PRICE,
  SIZES,
  bn,
  taka,
} from "@/lib/products";

const VIDEO_TITLE = "এমএস ফ্যাশন — টি-শার্ট কালেকশন";

const FEATURES = [
  { icon: "👕", title: "প্রিমিয়াম কোয়ালিটি", text: "১০০% নরম কম্বড কটন — বারবার ধোয়ার পরও আকৃতি ঠিক থাকে।" },
  { icon: "🔥", title: "ট্রেন্ডি কালেকশন", text: "নতুন প্রিন্ট আর প্রতিদিনের সলিড রঙ — সব মুডের জন্য।" },
  { icon: "🚚", title: "দ্রুত ডেলিভারি", text: "সারা বাংলাদেশে ১–৩ কর্মদিবসের মধ্যে ডেলিভারি।" },
  { icon: "💵", title: "ক্যাশ অন ডেলিভারি", text: "কোনো অগ্রিম টাকা নেই। পণ্য দেখে তারপর টাকা দিন।" },
];

const SIZE_ROWS = [
  ["M", 38, 27],
  ["L", 40, 28],
  ["XL", 42, 29],
  ["XXL", 44, 30],
];

const FAQS = [
  {
    q: "এক কম্বোতে কি ভিন্ন ভিন্ন ডিজাইন নেওয়া যাবে?",
    a: `হ্যাঁ। যেকোনো ${bn(COMBO_SIZE)}টি টি-শার্ট বাছুন — একই ডিজাইন বা আলাদা আলাদা — এবং প্রতিটির জন্য আলাদা সাইজ দিন।`,
  },
  {
    q: "কীভাবে টাকা পরিশোধ করব?",
    a: "ক্যাশ অন ডেলিভারি। পার্সেল হাতে পেয়ে দেখে তারপর ডেলিভারি ম্যানকে টাকা দিন।",
  },
  {
    q: "ডেলিভারি পেতে কত দিন লাগবে?",
    a: "ঢাকার ভিতরে ১–২ দিন, ঢাকার বাইরে ২–৩ কর্মদিবস।",
  },
  {
    q: "সাইজ না মিললে কী করব?",
    a: "ডেলিভারি ম্যানকে জানান অথবা ৩ দিনের মধ্যে আমাদের কল করুন — সাইজ পরিবর্তন করে দেওয়া হবে। শুধু ডেলিভারি চার্জ প্রযোজ্য।",
  },
];

export default async function Home() {
  const [products, [mainVideo, ...moreVideos] = []] = await Promise.all([getProducts(), getVideos()]);
  // "Regular price" for the offer banner: three of the priciest shirt.
  const REGULAR = (Math.max(0, ...products.map((p) => p.price)) || SINGLE_PRICE) * COMBO_SIZE;
  const SAVE = REGULAR - COMBO_PRICE;

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-black px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        <span className="text-gold">★</span> সারা বাংলাদেশে ক্যাশ অন ডেলিভারি · সাইজ পরিবর্তনের সুবিধা{" "}
        <span className="text-gold">★</span>
      </div>

      <main className="flex-1">
        {/* Videos (managed in the dashboard → Videos). The first one autoplays muted. */}
        {mainVideo && (
          <section className="bg-neutral-950 px-4 pt-10 text-white md:pt-14">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-center font-display text-3xl leading-tight md:text-4xl">
                মাত্র ৯৯৯ টাকায় ৩টি , <span className="text-gold"> টি-শার্ট কম্বো</span>
              </h2>
              <YouTubeVideo url={mainVideo.url} title={mainVideo.title || VIDEO_TITLE} />
              {moreVideos.length > 0 && (
                <div className="mt-8 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {moreVideos.map((v) => (
                    <YouTubeVideo key={v.id} url={v.url} title={v.title || VIDEO_TITLE} autoplay={false} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Offer hero */}
        <section className="relative overflow-hidden bg-neutral-950 text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
            <div>
              <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-sm font-semibold text-gold">
                🔥 কম্বো অফার
              </span>
              <h1 className="mt-5 font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">
                নিচের {bn(COMBO_SIZE)}টি টি-শার্ট
                <br />
                <span className="text-gold">পাচ্ছেন কম্বো অফারে </span>
              </h1>
              <p className="mt-5 max-w-md text-lg text-neutral-300">
                প্রিমিয়াম কটন কালেকশন থেকে পছন্দমতো বেছে নিন। নিয়মিত দাম{" "}
                <span className="line-through">{taka(REGULAR)}</span> — আজই সাশ্রয় করুন{" "}
                <strong className="text-white">{taka(SAVE)}</strong>।
              </p>

              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-neutral-400">অফার শেষ হবে আজ রাতেই</p>
                <Countdown />
              </div>

              <a
                href="#order"
                className="mt-9 inline-flex items-center gap-3 rounded-xl bg-gold px-8 py-4 text-lg font-bold text-black transition hover:bg-gold-light"
              >
                এখনই অর্ডার করুন <span aria-hidden>→</span>
              </a>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-gold/20 blur-3xl" aria-hidden />
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10">
                <Image
                  src={solidPack}
                  alt="মেরুন, সেজ গ্রিন ও নেভি রঙের তিনটি ভাঁজ করা টি-শার্ট"
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="absolute -bottom-5 -left-3 -rotate-6 rounded-2xl bg-white px-5 py-3 text-black shadow-xl sm:-left-6">
                <div className="text-xs font-semibold text-neutral-500">আপনার সাশ্রয়</div>
                <div className="font-display text-4xl leading-tight">{taka(SAVE)}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        {/* <section className="border-b border-neutral-200 bg-white">
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
        </section> */}

        {/* Collection */}
        {/* <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <SectionHeading eyebrow="আমাদের কালেকশন" title="আপনার পছন্দের টি-শার্ট" />
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {products.map((p) => (
              <div key={p.id} className="group overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200">
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={p.image}
                    alt={`${p.name} টি-শার্ট — ${p.color}`}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    style={{ objectPosition: p.position ?? "center" }}
                  />
                </div>
                <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1 p-4">
                  <div>
                    <h3 className="font-semibold leading-snug">{p.name}</h3>
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
              যেকোনো {bn(COMBO_SIZE)}টি নিন মাত্র {taka(COMBO_PRICE)}-এ
            </a>
          </div>
        </section> */}

        {/* Size chart */}
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto  max-w-6xl items-center gap-10 px-4 ">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200">
              <Image
                src={royalBlue}
                alt="রয়েল ব্লু প্লেইন টি-শার্ট"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
           
          </div>
        </section>

        {/* Order */}
        <section id="order" className="scroll-mt-4 bg-neutral-100 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading
              eyebrow={`${bn(COMBO_SIZE)}টি টি-শার্ট · ${taka(COMBO_PRICE)}`}
              title="অর্ডার করুন"
            />
            <p className="mx-auto mt-3 max-w-lg text-center text-neutral-600">
              নিচের ফর্মটি পূরণ করুন — কোনো অগ্রিম টাকা লাগবে না। পাঠানোর আগে আমরা কল করে কনফার্ম করব।
            </p>
            <div className="mt-10">
              <OrderForm products={products} />
            </div>
          </div>
        </section>

        {/* FAQ */}
        {/* <section className="mx-auto max-w-3xl px-4 py-16 md:py-20">
          <SectionHeading eyebrow="প্রশ্ন ও উত্তর" title="জেনে রাখুন" />
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
        </section> */}
      </main>

      <footer className="bg-black px-4 pb-24 pt-10 text-center text-sm text-neutral-400 md:pb-10">
        <div className="font-display text-3xl text-white">
          এমএস <span className="text-gold">ফ্যাশন</span> অ্যান্ড গার্মেন্টস
        </div>
        <p className="mt-1">স্টাইল আর আরামের মেলবন্ধন</p>
        <p className="mt-6">
          ডেলিভারি চার্জ: {DELIVERY.inside.label} {taka(DELIVERY.inside.fee)} · {DELIVERY.outside.label}{" "}
          {taka(DELIVERY.outside.fee)}
        </p>
        <p className="mt-2">© {bn(String(new Date().getFullYear()))} এমএস ফ্যাশন অ্যান্ড গার্মেন্টস। সর্বস্বত্ব সংরক্ষিত।</p>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="leading-tight">
          <div className="text-xs text-neutral-500 line-through">{taka(REGULAR)}</div>
          <div className="font-display text-2xl">{taka(COMBO_PRICE)}</div>
        </div>
        <a href="#order" className="flex-1 rounded-xl bg-black py-3 text-center font-bold text-white">
          {bn(COMBO_SIZE)}টি টি-শার্ট অর্ডার করুন
        </a>
      </div>
    </>
  );
}

function SectionHeading({ eyebrow, title, align = "center" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p className="text-sm font-semibold text-gold-dark">{eyebrow}</p>
      <h2 className="mt-2 font-display text-4xl leading-tight md:text-5xl">{title}</h2>
    </div>
  );
}
