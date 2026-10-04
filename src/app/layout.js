import { Baloo_Da_2, Hind_Siliguri } from "next/font/google";
import MetaPixel from "@/components/MetaPixel";
import { API_URL } from "@/lib/api";
import "./globals.css";

// Pixel ID from the dashboard, re-checked every minute. The page still renders if the API is down.
async function getPixelId() {
  try {
    const res = await fetch(`${API_URL}/api/settings/public`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(3000),
    });
    const json = await res.json();
    return json.data?.metaPixelId || null;
  } catch {
    return null;
  }
}

const hind = Hind_Siliguri({
  variable: "--font-hind",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
});

const baloo = Baloo_Da_2({
  variable: "--font-baloo",
  weight: ["700", "800"],
  subsets: ["bengali", "latin"],
});

export const metadata = {
  title: "যেকোনো ৩টি টি-শার্ট মাত্র ৳৯৯০ | এমএস ফ্যাশন অ্যান্ড গার্মেন্টস",
  description:
    "প্রিমিয়াম কটন টি-শার্ট — যেকোনো ৩টি মাত্র ৳৯৯০। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
};

export default async function RootLayout({ children }) {
  const pixelId = await getPixelId();
  return (
    <html
      lang="bn"
      className={`${hind.variable} ${baloo.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <MetaPixel pixelId={pixelId} />
      </body>
    </html>
  );
}
