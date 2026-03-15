// components/CartWidget.tsx
"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function CartWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Link href="/cart" className="text-gray-600 hover:text-[#e3000f] flex flex-col items-center relative transition-colors">
      <div className="relative">
        <ShoppingCart size={22} />
        {isMounted && totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#e3000f] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </div>
      <span className="text-[11px] mt-1 font-semibold uppercase">Carrito</span>
    </Link>
  );
}