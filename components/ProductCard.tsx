// components/ProductCard.tsx
"use client";

import Link from "next/link";
import { ShoppingCart, Package, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

export default function ProductCard({
  product,
  bcvRate = 36.5,
}: {
  product: any;
  bcvRate?: number;
}) {
  const { addToCart } = useCartStore();
  const [added, setAdded] = useState(false);

  if (!product || !product.id) return null;

  const priceUsd = Number(product.price_usd) || 0;
  const priceBs = (priceUsd * bcvRate).toFixed(2);

  // Filtro de stock: solo mostrar si stock > 0
  const inStock = Number(product.stock) > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inStock) return;

    addToCart({
      id: product.id,
      name: product.name,
      priceUSD: priceUsd,
    });

    // Feedback visual temporal
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col group h-full">
      {/* 1. ZONA CLICABLE (FOTO Y TEXTO) */}
      <Link
        href={`/product/${product.id}`}
        className="flex-1 flex flex-col overflow-hidden rounded-t-2xl"
      >
        <div className="aspect-square bg-gray-50 relative flex items-center justify-center p-4">
          {!inStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-t-2xl">
              <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                Sin stock
              </span>
            </div>
          )}
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name || "Producto"}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
            />
          ) : (
            <Package size={48} className="text-gray-300" />
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {product.category || "General"}
          </span>
          <h3 className="text-sm font-bold text-gray-800 leading-tight mb-3 line-clamp-2 group-hover:text-[#e3000f] transition-colors">
            {product.name || "Producto sin nombre"}
          </h3>

          <div className="mt-auto">
            <div className="text-xl font-extrabold text-[#e3000f]">
              ${priceUsd.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 font-medium">
              Bs. {priceBs}
            </div>
          </div>
        </div>
      </Link>

      {/* 2. ZONA DEL BOTÓN (SEPARADO DEL LINK) */}
      <div className="px-5 pb-5 pt-2 mt-auto">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
            added
              ? "bg-green-600 text-white"
              : inStock
              ? "bg-gray-900 text-white hover:bg-[#e3000f]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
          }`}
        >
          {added ? (
            <>
              <Check size={16} /> ¡Añadido!
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              {inStock ? "Añadir al carrito" : "Sin stock"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
