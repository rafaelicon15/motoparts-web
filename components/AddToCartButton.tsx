// components/AddToCartButton.tsx
"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import Link from "next/link";
import MorphActionIcon from "./MorphActionIcon";
import { Minus, Plus } from "lucide-react";

type Props = {
  product: {
    id: string;
    name: string;
    priceUSD: number;
  };
  inStock: boolean;
  maxQuantity?: number;
};

export default function AddToCartButton({ product, inStock, maxQuantity = 99 }: Props) {
  const { addToCart } = useCartStore();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    if (!inStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-3">
        <span className="text-sm font-bold text-gray-700">Cantidad</span>
        <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1">
          <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-white" aria-label="Disminuir cantidad"><Minus size={16} /></button>
          <span className="w-10 text-center font-extrabold text-gray-900">{quantity}</span>
          <button type="button" onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))} className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 hover:bg-white" aria-label="Aumentar cantidad"><Plus size={16} /></button>
        </div>
      </div>
      <button
        onClick={handleAdd}
        disabled={!inStock || maxQuantity < 1}
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
            <MorphActionIcon name="check" size={20} /> ¡Añadido al carrito!
          </>
        ) : (
          <>
            <MorphActionIcon name="cart" size={20} />
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
