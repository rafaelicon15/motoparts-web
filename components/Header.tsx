import Link from 'next/link';
import { Search, User, MapPin, Phone, Store } from 'lucide-react';
import { getBcvRate } from '@/lib/dolarApi';
import CartWidget from './CartWidget';

export default async function Header({ hideCategories = false, hideCart = false }: { hideCategories?: boolean; hideCart?: boolean }) {
  let bcvRate = 922.56;
  try {
    bcvRate = await getBcvRate();
  } catch {
    // La cabecera conserva una tasa referencial si la API no responde.
  }

  const categories = ['Motor', 'Frenos', 'Transmisión', 'Suspensión', 'Accesorios'];

  return (
    <header className="w-full">
      <div className="bg-[#e3000f] px-4 py-2 text-xs text-white md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="flex items-center gap-4"><span className="flex items-center gap-1"><MapPin size={14} /> Envíos a todo el país</span><span className="hidden items-center gap-1 sm:flex"><Phone size={14} /> 0800-MOTOPART</span></div>
          <span className="font-semibold tracking-wide">Tasa BCV: Bs. {bcvRate.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 md:flex-row md:justify-between">
          <Link href="/" className="flex items-center gap-2 text-3xl font-black tracking-tight text-slate-900"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3000f] text-xl text-white shadow-sm">M</span>Moto<span className="text-[#e3000f]">Parts</span></Link>
          <form action="/" className="relative w-full max-w-xl">
            <input name="q" type="search" placeholder="Buscar repuestos, marcas o modelos..." className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-5 pr-12 text-sm outline-none transition focus:border-[#e3000f] focus:bg-white focus:ring-2 focus:ring-red-100" />
            <button aria-label="Buscar" className="absolute right-2 top-2 rounded-full p-2 text-slate-400 transition hover:bg-red-50 hover:text-[#e3000f]"><Search size={19} /></button>
          </form>
          <div className="flex items-center gap-5">
            <Link href="/login" className="flex flex-col items-center text-slate-500 transition hover:text-[#e3000f]"><User size={22} /><span className="mt-1 text-[11px] font-extrabold uppercase">Cuenta</span></Link>
            {!hideCart && <CartWidget />}
          </div>
        </div>
      </div>

      {!hideCategories && <nav className="border-b border-slate-200 bg-slate-50 px-4 md:px-8"><div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto py-3 text-sm font-bold"><Link href="/" className="flex shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-white"><Store size={15} /> Todas las categorías</Link>{categories.map((category) => <Link key={category} href={`/?category=${encodeURIComponent(category)}`} className="shrink-0 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-white hover:text-[#e3000f]">{category}</Link>)}<Link href="/terms" className="ml-auto hidden shrink-0 text-slate-500 hover:text-[#e3000f] lg:block">Ventas al mayor</Link></div></nav>}
    </header>
  );
}
