// app/(shop)/page.tsx
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export const revalidate = 0; // Para que el catálogo siempre esté fresco al recargar

export default async function ShopPage() {
  // 1. Traer todos los productos de la BD
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. Traer Tasa BCV (o usar contingencia)
  let bcvRate = 443.26;
  try {
    const res = await fetch('https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv', { cache: 'no-store' });
    const data = await res.json();
    if (data?.monitors?.bcv?.price) bcvRate = data.monitors.bcv.price;
  } catch (e) {
    console.log("Error BCV, usando contingencia");
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* Banner Hero */}
      <div className="bg-gray-900 rounded-3xl p-12 text-center text-white mb-12 shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Todo para tu Moto</h1>
        <p className="text-gray-400">Calidad garantizada y envíos a nivel nacional</p>
      </div>

      {/* Nuevos Ingresos */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-[#e3000f] pb-2 inline-block mb-6">
          Nuevos Ingresos
        </h2>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                bcvRate={bcvRate} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500 font-medium shadow-sm">
            Aún no hay repuestos en el catálogo. ¡Ve al panel de administrador y sube el primero!
          </div>
        )}
      </div>
    </div>
  );
}