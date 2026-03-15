// app/(shop)/cart/page.tsx
"use client";

import Link from 'next/link';
import { Trash2, ArrowRight, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { cart, removeFromCart, clearCart } = useCartStore();

  // Evitamos errores de hidratación entre servidor y cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Calculamos el total en dólares sumando (precio * cantidad) de cada item
  const totalUSD = cart.reduce((total, item) => total + (item.priceUSD * item.quantity), 0);

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 md:px-8 min-h-[60vh]">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b-4 border-[#e3000f] inline-block pb-2">
        Tu Carrito de Compras
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center">
          <AlertCircle size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-6">Parece que aún no has añadido ningún repuesto a tu pedido.</p>
          <Link href="/" className="bg-[#e3000f] text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
            Volver a la Tienda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Lista de Productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <span className="text-sm text-gray-500">Cantidad: {item.quantity}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className="font-extrabold text-[#e3000f] text-lg">
                    ${(item.priceUSD * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Eliminar producto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              onClick={clearCart}
              className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors mt-4 inline-block"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Resumen de Compra */}
          <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg h-fit">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span>${totalUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Envío</span>
                <span className="text-green-400 text-sm">Por calcular</span>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total (USD)</span>
                <span className="text-2xl font-extrabold text-[#e3000f]">${totalUSD.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                *El equivalente en Bs se calculará al procesar el pago.
              </p>
            </div>

            <button className="w-full bg-[#e3000f] text-white py-3.5 rounded-lg font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
              Proceder al Pago
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}