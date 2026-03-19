// components/AddToCartButton.tsx
"use client";

import { ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import Link from "next/link";

type Props = {
  product: {
    id: string;
    name: string;
    priceUSD: number;
  };
  inStock: boolean;
};

export default function AddToCartButton({ product, inStock }: Props) {
  const { addToCart } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!inStock) return;
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleAdd}
        disabled={!inStock}
        className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-2 shadow-lg ${
          added
            ? "bg-green-600 text-white"
            : inStock
            ? "bg-gray-900 text-white hover:bg-[#e3000f]"
            : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
        }`}
      >
        {added ? (
          <>
            <Check size={20} /> ¡Añadido al carrito!
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            {inStock ? "Añadir al carrito" : "Sin stock disponible"}
          </>
        )}
      </button>

      {added && (
        <Link
          href="/cart"
          className="w-full py-3 rounded-2xl font-bold text-sm text-center border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
        >
          Ver carrito →
        </Link>
      )}
    </div>
  );
}
