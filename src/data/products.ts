export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating?: number;
};

export const categories = [
  "All",
  "Audio",
  "Home",
  "Wearables",
  "Travel",
  "Photography",
  "Furniture",
] as const;

export const products: Product[] = [
  /* 1 */
  {
  id: "aurora-wireless-headphones",
  name: "Aurora Wireless Headphones",
  price: 129.99,
  category: "Audio",
  description: "Wireless headphones with rich sound, comfortable ear cushions, and long-lasting battery life.",
  image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  rating: 4.8,
},
/* 2 */
{
  id: "nordic-table-lamp",
  name: "Nordic Table Lamp",
  price: 79.99,
  description: "Minimalist table lamp designed to bring warm and focused light to your workspace.",
  category: "Home",
  description: "Wireless headphones with rich sound, comfortable ear cushions, and long-lasting battery life.",
  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  rating: 4.5,
  image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
},
/* 3 */
{
  id:  "pulse-smartwatch",
  name: "Pulse Smartwatch",
  price: 199.99,
  category: "Wearables",
  description: "Modern smartwatch with fitness tracking, notifications, and a clean everyday design.",
  image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  rating: 4.6,
},
/* 4 */
{
  id:  "voyager-backpack",
  name: "Voyager Everyday Backpack",
  price: 89.99,
  category: "Travel",
  description: "Durable everyday backpack with organized storage for work, travel, and daily essentials.",
  image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
  rating: 4.7,
},
/* 5 */
{
  id:  "focus-camera",
  name:  "Focus Mirrorless Camera",
  price:  899.99,
  category: "Photography",
  description: "Compact mirrorless camera designed for creators who want sharp images and easy portability.",
  image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  rating: 4.9,
},
/* 6 */
{
  id:  "oak-lounge-chair",
  name:  "Oak Lounge Chair",
  price:  329.99,
  category:  "Furniture",
  description: "Comfortable modern lounge chair with natural oak details and timeless Scandinavian styling.",
  image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
  rating: 4.4,
},
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function findProduct(id: string) {
  return products.find((product) => product.id === id);
}
