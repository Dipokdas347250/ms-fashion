import loveNavy from "@/assets/love-navy.jpg";
import royalBlue from "@/assets/royal-blue.jpg";
import skyTree from "@/assets/sky-tree.jpg";
import solidPack from "@/assets/solid-pack.jpg";

// Edit prices here — every section of the page reads from these values.
export const COMBO_SIZE = 3;
export const COMBO_PRICE = 990;
export const SINGLE_PRICE = 450;
export const DELIVERY = {
  inside: { label: "Inside Dhaka", fee: 70 },
  outside: { label: "Outside Dhaka", fee: 130 },
};
export const SIZES = ["M", "L", "XL", "XXL"];

// `position` crops one shirt out of the folded three-pack photo.
export const PRODUCTS = [
  { id: "love-navy", name: "#LOVE Print", color: "Navy", image: loveNavy },
  { id: "royal-blue", name: "Classic Plain", color: "Royal Blue", image: royalBlue },
  { id: "sky-tree", name: "Tree & Birds Print", color: "Sky Blue", image: skyTree },
  { id: "maroon", name: "Premium Solid", color: "Maroon", image: solidPack, position: "8% 50%" },
  { id: "sage", name: "Premium Solid", color: "Sage Green", image: solidPack, position: "50% 50%" },
  { id: "navy", name: "Premium Solid", color: "Navy", image: solidPack, position: "92% 50%" },
];

export const taka = (n) => `৳${n.toLocaleString("en-US")}`;
