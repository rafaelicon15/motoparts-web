// components/Header.tsx
import Link from 'next/link';
import { Search, User, MapPin, Phone } from 'lucide-react';
import { getBcvRate } from '@/lib/dolarApi';
import CartWidget from './CartWidget';

export default async function Header({ hideCategories = false, hideCart = false }: { hideCategories?: boolean; hideCart?: boolean }) {
  const bcvRate = await getBcvRate();

  return (
    <header className="w-full">
      {/* Barra Superior (Top Bar - Roja) */}
      <div className="bg-[#e3000f] text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><MapPin size={14} /> Envíos a todo el país</span>
          <span className="flex items-center gap-1"><Phone size={14} /> 0800-MOTOPART</span>
        </div>
        <div>
          <span className="font-semibold tracking-wide">Tasa BCV: Bs. {bcvRate.toFixed(2)}</span>
        </div>
      </div>

      {/* Navegación Principal (Blanca) */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Moto<span className="text-[#e3000f]">Parts</span>
        </Link>

        {/* Barra de Búsqueda */}
        <div className="flex-1 w-full max-w-xl relative">
          <input 
            type="text" 
            placeholder="Buscar repuestos, marcas o modelos..." 
            className="w-full border border-gray-300 rounded-full py-2.5 px-5 pr-12 text-sm focus:outline-none focus:border-[#e3000f] focus:ring-1 focus:ring-[#e3000f] transition-all"
          />
          <button className="absolute right-4 top-2.5 text-gray-400 hover:text-[#e3000f] transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Iconos de Acción */}
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-gray-600 hover:text-[#e3000f] flex flex-col items-center transition-colors">
            <User size={22} />
            <span className="text-[11px] mt-1 font-semibold uppercase">Cuenta</span>
          </Link>
          {!hideCart && <CartWidget />}
        </div>
      </div>

      {/* Barra de Categorías (Gris Claro) - SE OCULTA SI hideCategories ES TRUE */}
      {!hideCategories && (
        <nav className="bg-gray-50 py-3 px-4 md:px-8 flex gap-8 text-sm font-semibold text-gray-600 overflow-x-auto border-b border-gray-200">
          <Link href="#" className="hover:text-[#e3000f] whitespace-nowrap transition-colors">Todas las Categorías</Link>
          <Link href="#" className="hover:text-[#e3000f] whitespace-nowrap transition-colors">Motor</Link>
          <Link href="#" className="hover:text-[#e3000f] whitespace-nowrap transition-colors">Frenos</Link>
          <Link href="#" className="hover:text-[#e3000f] whitespace-nowrap transition-colors">Transmisión</Link>
          <Link href="#" className="hover:text-[#e3000f] whitespace-nowrap transition-colors">Suspensión</Link>
          <Link href="#" className="hover:text-[#e3000f] whitespace-nowrap transition-colors">Accesorios</Link>
        </nav>
      )}
    </header>
  );
}