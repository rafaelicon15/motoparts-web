// app/(shop)/page.tsx
import { getBcvRate } from '@/lib/dolarApi';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

// Revalidamos la tienda cada 60 segundos para que sea rápida pero muestre productos nuevos
export const revalidate = 60;

export default async function ShopPage() {
  const bcvRate = await getBcvRate();

  // Consultamos los productos reales de nuestra base de datos (Supabase)
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error cargando productos:", error);
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8">
      {/* Banner Principal */}
      <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl h-64 mb-12 flex flex-col items-center justify-center border border-gray-700 shadow-lg text-center px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-2">Todo para tu Moto</h2>
        <p className="text-gray-300">Calidad garantizada y envíos a nivel nacional</p>
      </div>

      {/* Título de Sección */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 border-b-4 border-[#e3000f] inline-block pb-1">
          Nuevos Ingresos
        </h2>
      </div>
      
      {/* Cuadrícula de Productos Reales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              category={product.category}
              priceUSD={product.price_usd} // Tomamos el precio de la base de datos
              bcvRate={bcvRate}
              imageUrl={product.image_url} // Le pasamos la URL de la foto sin fondo
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">
              Aún no hay repuestos en el catálogo. ¡Ve al panel de administrador y sube el primero!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}