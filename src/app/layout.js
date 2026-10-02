import { Baloo_Da_2, Hind_Siliguri } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      className={`${hind.variable} ${baloo.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
