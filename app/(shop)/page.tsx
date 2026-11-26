import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { getBcvRate } from '@/lib/dolarApi';
import { demoProducts, type StoreProduct } from '@/lib/demoProducts';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import MorphActionIcon from '@/components/MorphActionIcon';

export const revalidate = 0;

const categories = ['Todas', 'Motor', 'Frenos', 'Transmisión', 'Suspensión', 'Accesorios'];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || '').trim().toLowerCase();
  const selectedCategory = params.category || 'Todas';

  let products: StoreProduct[] = [];
  try {
    const result = await supabase.from('products').select('*').order('created_at', { ascending: false });
    products = result.data || [];
  } catch {
    products = [];
  }

  const usingDemo = products.length === 0;
  const sourceProducts = usingDemo ? demoProducts : products;
  const filteredProducts = sourceProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    const haystack = `${product.name} ${product.category} ${product.description || ''}`.toLowerCase();
    return matchesCategory && (!query || haystack.includes(query));
  });

  let bcvRate = 922.56;
  try {
    bcvRate = await getBcvRate();
  } catch {
    // La tasa referencial mantiene la tienda utilizable durante el modo demo.
  }

  const hrefForCategory = (category: string) => {
    const queryString = new URLSearchParams();
    if (params.q) queryString.set('q', params.q);
    if (category !== 'Todas') queryString.set('category', category);
    const suffix = queryString.toString();
    return suffix ? `/?${suffix}` : '/';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 md:px-8 md:py-10">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#111827] px-6 py-10 text-white shadow-xl md:px-12 md:py-14">
        <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#e3000f]/25 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-red-100">
            <span className="h-2 w-2 rounded-full bg-[#e3000f]" /> Repuestos que sí responden
          </div>
          <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">Tu moto lista para todo.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 md:text-lg">Piezas confiables, precios claros y despacho a todo el país. Compra al detal o solicita tu cotización mayorista.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalogo" className="rounded-xl bg-[#e3000f] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-950/30 transition hover:bg-red-700">Ver catálogo</a>
            <Link href="/?category=Accesorios" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Explorar accesorios <MorphActionIcon name="arrow-right" size={16} className="ml-1 inline" /></Link>
          </div>
        </div>
        <div className="relative mt-9 grid max-w-3xl grid-cols-1 gap-3 text-sm text-slate-200 sm:grid-cols-3 md:absolute md:bottom-10 md:right-10 md:mt-0 md:w-[45%]">
          {[['Envíos nacionales', 'truck'], ['Compra segura', 'shield'], ['Stock verificado', 'package']].map(([label, icon]) => (
            <div key={label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur"><MorphActionIcon name={icon as 'truck' | 'shield' | 'package'} size={17} className="text-red-400" label={label} /><span>{label}</span></div>
          ))}
        </div>
      </section>

      <section className="-mt-5 relative z-10 grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-lg sm:grid-cols-3">
        {[['Entrega nacional', 'Despachamos con las principales agencias'], ['Precios al mayor', 'Descuentos para talleres y negocios'], ['Atención directa', 'Te ayudamos a encontrar la pieza']].map(([title, text]) => <div key={title} className="flex items-start gap-3 px-2 py-2"><CheckCircle2 className="mt-0.5 shrink-0 text-[#e3000f]" size={19} /><div><p className="text-sm font-extrabold text-slate-900">{title}</p><p className="mt-0.5 text-xs text-slate-500">{text}</p></div></div>)}
      </section>

      <section id="catalogo" className="mt-12 scroll-mt-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#e3000f]">Catálogo destacado</p><h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">Encuentra tu repuesto</h2><p className="mt-2 text-sm text-slate-500">{usingDemo ? 'Muestra comercial con referencias públicas de MercadoLibre, lista para reemplazar por el inventario de tu cliente.' : `${sourceProducts.length} productos disponibles en tu catálogo.`}</p></div>
          {usingDemo && <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">Modo demostración</span>}
        </div>

        {usingDemo && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800">Los productos con etiqueta azul son referencias de MercadoLibre usadas únicamente para mostrar cómo se vería una tienda real. Precios, stock y disponibilidad deben confirmarse antes de vender.</div>}

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => <Link key={category} href={hrefForCategory(category)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition ${selectedCategory === category ? 'border-[#e3000f] bg-[#e3000f] text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-[#e3000f]'}`}>{category}</Link>)}
        </div>

        {filteredProducts.length > 0 ? <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} bcvRate={bcvRate} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><p className="font-bold text-slate-800">No encontramos repuestos con esa búsqueda.</p><p className="mt-1 text-sm text-slate-500">Prueba con otra palabra o revisa todas las categorías.</p><Link href="/" className="mt-5 inline-block rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white">Ver todo el catálogo</Link></div>}
      </section>
    </div>
  );
}
