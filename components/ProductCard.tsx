// components/ProductCard.tsx
import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';

export default function ProductCard({ product, bcvRate = 443.26 }: { product: any, bcvRate?: number }) {
  // ESCUDO: Si la base de datos envía un producto fantasma o vacío, lo ignoramos para que no rompa la tienda
  if (!product || typeof product.price_usd === 'undefined') return null;

  const priceUsd = product.price_usd || 0;
  const priceBs = (priceUsd * bcvRate).toFixed(2);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group">
      
      <Link href={`/product/${product.id}`} className="flex-1 flex flex-col cursor-pointer">
        <div className="aspect-square bg-gray-50 relative flex items-center justify-center p-4 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name || 'Producto'}
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
            />
          ) : (
            <Package size={48} className="text-gray-300" />
          )}
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            {product.category || 'General'}
          </span>
          <h3 className="text-sm font-bold text-gray-800 leading-tight mb-3 line-clamp-2 group-hover:text-[#e3000f] transition-colors">
            {product.name || 'Producto sin nombre'}
          </h3>

          <div className="mt-auto">
            <div className="text-xl font-extrabold text-[#e3000f]">
              ${priceUsd}
            </div>
            <div className="text-xs text-gray-400 font-medium">
              Bs. {priceBs}
            </div>
          </div>
        </div>
      </Link>

      <div className="px-5 pb-5 pt-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            alert(`¡Añadido ${product.name} al carrito de compras!`);
          }}
          className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#e3000f] transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <ShoppingCart size={16} /> Añadir al carrito
        </button>
      </div>
    </div>
  );
}