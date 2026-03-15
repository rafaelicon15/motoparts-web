// components/ProductCard.tsx
"use client"; // <-- ¡Esto es crucial! Le dice a Next.js que esto corre en el navegador

import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

type ProductCardProps = {
  id: string;
  name: string;
  category: string;
  priceUSD: number;
  bcvRate: number;
  imageUrl?: string;
};

export default function ProductCard({ id, name, category, priceUSD, bcvRate, imageUrl }: ProductCardProps) {
  const priceBs = (priceUSD * bcvRate).toFixed(2);
  
  // Traemos la función de añadir al carrito desde nuestro store
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({ id, name, priceUSD });
    // Aquí podríamos agregar una notificación tipo "Toast" en el futuro
    console.log(`¡${name} añadido al carrito!`); 
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group flex flex-col">
      <div className="bg-gray-50 w-full h-48 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <span className="text-gray-300 text-sm">Sin imagen</span>
        )}
      </div>
      
      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{category}</p>
      <h3 className="font-bold text-gray-800 text-base mt-1 line-clamp-2 leading-tight flex-1">
        {name}
      </h3>
      
      <div className="mt-3 flex flex-col">
        <span className="text-xl font-extrabold text-[#e3000f]">${priceUSD.toFixed(2)}</span>
        <span className="text-xs text-gray-500 font-medium">Bs. {priceBs}</span>
      </div>
      
      {/* Botón conectado al evento onClick */}
      <button 
        onClick={handleAddToCart}
        className="w-full mt-4 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-[#e3000f] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
      >
        <ShoppingCart size={16} />
        Añadir al carrito
      </button>
    </div>
  );
}