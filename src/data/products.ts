export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  badge: string;
  rating: number;
};

export const products: Product[] = [
  {
    id: "aurora-headphones",
    name: "Aurora Headphones",
    price: 189,
    category: "Audio",
    description: "Noise-canceling headphones dengan suara studio dan desain premium.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    badge: "Best Seller",
    rating: 4.9,
  },
  {
    id: "lumen-lamp",
    name: "Lumen Desk Lamp",
    price: 89,
    category: "Home",
    description: "Lampu meja pintar dengan pencahayaan hangat untuk ruang kerja modern.",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
    badge: "New Arrival",
    rating: 4.8,
  },
  {
    id: "nova-watch",
    name: "Nova Smart Watch",
    price: 249,
    category: "Wearables",
    description: "Jam tangan pintar dengan pelacakan kesehatan dan desain ramping.",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    badge: "Editor Choice",
    rating: 4.7,
  },
  {
    id: "terra-bag",
    name: "Terra Travel Bag",
    price: 129,
    category: "Travel",
    description: "Tas perjalanan modular dengan ruang luas dan material tahan air.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    badge: "Limited",
    rating: 4.6,
  },
  {
    id: "solis-camera",
    name: "Solis Mirrorless Camera",
    price: 799,
    category: "Photography",
    description: "Kamera compact untuk hasil foto jernih dan video cinematic.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    badge: "Pro Pick",
    rating: 4.9,
  },
  {
    id: "cove-chair",
    name: "Cove Accent Chair",
    price: 299,
    category: "Furniture",
    description: "Kursi nyaman untuk ruang tamu atau sudut kerja yang terasa premium.",
    image:
      "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=800&q=80",
    badge: "Trending",
    rating: 4.5,
  },
];

export const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))];
