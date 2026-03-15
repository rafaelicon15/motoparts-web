// app/(shop)/page.tsx
import { getBcvRate } from '@/lib/dolarApi';
import ProductCard from '@/components/ProductCard';

export default async function ShopPage() {
  const bcvRate = await getBcvRate();

  // Productos de prueba (Mock Data). Luego esto vendrá de Supabase.
  const featuredProducts = [
    { id: '1', name: 'Amortiguador Trasero Monoshock Pro', category: 'Suspensión', priceUSD: 45.00 },
    { id: '2', name: 'Faro LED Frontal Alta Potencia', category: 'Iluminación', priceUSD: 25.50 },
    { id: '3', name: 'Kit de Arrastre Reforzado', category: 'Transmisión', priceUSD: 38.00 },
    { id: '4', name: 'Pastillas de Freno de Cerámica', category: 'Frenos', priceUSD: 12.00 },
    { id: '5', name: 'Batería de Gel 12V 7Ah', category: 'Eléctrico', priceUSD: 22.00 },
    { id: '6', name: 'Aceite Semi-Sintético 4T 10W-40', category: 'Lubricantes', priceUSD: 8.50 },
    { id: '7', name: 'Caucho Trasero 130/70-17', category: 'Neumáticos', priceUSD: 55.00 },
    { id: '8', name: 'Bujía de Iridium NGK', category: 'Motor', priceUSD: 6.00 },
  ];

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
      
      {/* Cuadrícula de Productos (Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id}
            name={product.name}
            category={product.category}
            priceUSD={product.priceUSD}
            bcvRate={bcvRate}
          />
        ))}
      </div>
    </div>
  );
}