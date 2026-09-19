import { getProductCategories, getProducts } from "@/lib/products";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage(){
  const [products,categories] = await Promise.all([getProducts(),getProductCategories()]);
  return <ProductsClient initialProducts={products} categories={categories}/>;
}
