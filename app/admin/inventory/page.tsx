// app/admin/inventory/page.tsx
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // No usar caché, siempre datos frescos

export default async function InventoryPage() {
  // Traer los productos de Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.error("Error cargando inventario:", error);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
        
        {/* Este botón nos llevará al formulario de creación */}
        <Link href="/admin/inventory/new" className="bg-[#e3000f] text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 font-semibold">Producto</th>
              <th className="px-6 py-4 font-semibold">Categoría</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
              <th className="px-6 py-4 font-semibold">Detal (USD)</th>
              <th className="px-6 py-4 font-semibold">Mayor (USD)</th>
              <th className="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products?.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                    )}
                  </div>
                  {product.name}
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">{product.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900 font-semibold">${product.price_usd}</td>
                <td className="px-6 py-4 text-green-600 font-semibold">${product.wholesale_price_usd}</td>
                <td className="px-6 py-4 flex justify-end gap-3">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                    <Edit size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}