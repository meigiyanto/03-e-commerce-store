"use client";

import {useMemo,useState} from "react";
import {Search,Filter} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import StorePageHeader from "@/components/store/StorePageHeader";
import type {Product} from "@/types/product";

export default function ProductsClient({initialProducts,categories}:{initialProducts:Product[];categories:string[]}){
  const [q,setQ] = useState(""),
        [cat,setCat] = useState("Semua"),
        [sort,setSort] = useState("newest"),
        [stock,setStock] = useState(false);
  const products = useMemo(() => initialProducts.filter(p => (!q||`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(q.toLowerCase()))&&(cat==="Semua"||p.category===cat)&&(!stock||p.stock>0)).sort((a,b)=>sort==="price-asc"?a.price-b.price:sort==="price-desc"?b.price-a.price:sort==="rating"?b.rating-a.rating:0),[initialProducts,q,cat,sort,stock]);
 
  return (
    <main className="min-h-screen bg-gray-50">
      <StorePageHeader eyebrow="Katalog" title="Semua Produk" description="Produk, harga, dan stok berasal langsung dari database toko."/>
      <section className="mx-auto max-w-7xl px-4 py-7 md:px-8">
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border bg-white p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cari produk..." className="h-11 w-full rounded-xl bg-gray-50 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-100"/></div>
            <select value={cat} onChange={e=>setCat(e.target.value)} className="h-11 rounded-xl border px-3 text-sm">
              {
                ["Semua",...categories].map(x=><option key={x}>{x}</option>)
              }
            </select>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="h-11 rounded-xl border px-3 text-sm">
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga terendah</option>
              <option value="price-desc">Harga tertinggi</option>
              <option value="rating">Rating</option>
            </select>
            <label className="flex h-11 items-center gap-2 px-2 text-sm"><input type="checkbox" checked={stock} onChange={e=>setStock(e.target.checked)}/><Filter size={16}/>Tersedia</label>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          <b className="text-gray-950">{products.length}</b> produk</p>
          {
            products.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {
                products.map(p=><ProductCard key={p.id} product={p}/>)
              }
            </div> : <div className="rounded-2xl border border-dashed bg-white p-16 text-center text-gray-500">Produk tidak ditemukan.</div>
          }
      </section>
   </main>
  )
}
