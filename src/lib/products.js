import loveNavy from "@/assets/love-navy.jpg";
import royalBlue from "@/assets/royal-blue.jpg";
import skyTree from "@/assets/sky-tree.jpg";
import solidPack from "@/assets/solid-pack.jpg";

// Edit prices here — every section of the page reads from these values.
export const COMBO_SIZE = 3;
export const COMBO_PRICE = 990;
export const SINGLE_PRICE = 450;
export const DELIVERY = {
  inside: { label: "ঢাকার ভিতরে", fee: 70 },
  outside: { label: "ঢাকার বাইরে", fee: 130 },
};
export const SIZES = ["M", "L", "XL", "XXL"];

// Fallback video, shown only if the API is down. Manage the real videos in the dashboard → Videos.
export const YOUTUBE_URL = "https://youtube.com/shorts/9kgAlgIJcxE?si=I2lvXF0H6t3w1cB4";

// `position` crops one shirt out of the folded three-pack photo.
export const PRODUCTS = [
  { id: "love-navy", name: "#LOVE প্রিন্ট", color: "নেভি ব্লু", image: loveNavy },
  { id: "royal-blue", name: "ক্লাসিক প্লেইন", color: "রয়েল ব্লু", image: royalBlue },
  { id: "sky-tree", name: "গাছ ও পাখি প্রিন্ট", color: "স্কাই ব্লু", image: skyTree },
  { id: "maroon", name: "প্রিমিয়াম সলিড", color: "মেরুন", image: solidPack, position: "8% 50%" },
  { id: "sage", name: "প্রিমিয়াম সলিড", color: "সেজ গ্রিন", image: solidPack, position: "50% 50%" },
  { id: "navy", name: "প্রিমিয়াম সলিড", color: "নেভি", image: solidPack, position: "92% 50%" },
];

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

// Bengali numerals, with thousands separators.
export const bn = (n) =>
  Number(n)
    .toLocaleString("en-US")
    .replace(/\d/g, (d) => BN_DIGITS[d]);

export const taka = (n) => `৳${bn(n)}`;
