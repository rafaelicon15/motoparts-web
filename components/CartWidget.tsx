// components/CartWidget.tsx
"use client";

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useSyncExternalStore } from 'react';
import MorphActionIcon from './MorphActionIcon';

export default function CartWidget() {
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Link href="/cart" className="text-gray-600 hover:text-[#e3000f] flex flex-col items-center relative transition-colors">
      <div className="relative">
        <MorphActionIcon name="cart" size={22} />
        {isMounted && totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#e3000f] text-white text-[10px] font-extrabold min-w-[18px] min-h-[18px] px-1 rounded-full flex items-center justify-center leading-none">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </div>
      <span className="text-[11px] mt-1 font-semibold uppercase">Carrito</span>
    </Link>
  );
}
