// app/admin/inventory/page.tsx
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function InventoryPage() {
  // Obtenemos los productos ordenados por los más recientes
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) console.log("Aviso cargando inventario:", error);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Inventario General</h1>
          <p className="text-gray-500 mt-1">Gestiona tus repuestos, precios y stock físico.</p>
        </div>
        
        <Link href="/admin/inventory/new" className="bg-[#e3000f] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm">
          <Plus size={20} />
          Nuevo Producto
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 font-semibold">Producto</th>
                <th className="px-6 py-4 font-semibold">Categoría</th>
                <th className="px-6 py-4 font-semibold">Modo de Venta</th>
                <th className="px-6 py-4 font-semibold text-center">Stock Físico</th>
                <th className="px-6 py-4 font-semibold">Detal / Mayor</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Package size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="font-medium text-lg">Tu inventario está vacío</p>
                    <p className="text-sm">Haz clic en "Nuevo Producto" para empezar a vender.</p>
                  </td>
                </tr>
              )}
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center p-1">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="max-w-full max-h-full object-contain" />
                        ) : (
                          <span className="text-gray-300"><Package size={20}/></span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">ID: {product.id.split('-')[0]}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      {product.category || 'General'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {product.sale_mode === 'both' && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Mayor y Detal</span>}
                    {product.sale_mode === 'retail_only' && <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">Solo Detal</span>}
                    {product.sale_mode === 'wholesale_only' && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Solo Mayor</span>}
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-sm font-extrabold ${product.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock} unds
                      </span>
                      {product.units_per_box > 1 && (
                        <span className="text-[10px] text-gray-400 font-medium">
                          ({Math.floor(product.stock / product.units_per_box)} cajas)
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {product.sale_mode !== 'wholesale_only' ? (
                        <span className="text-sm font-bold text-gray-700">D: ${product.price_usd}</span>
                      ) : (
                        <span className="text-sm text-gray-300 line-through">D: N/A</span>
                      )}
                      
                      {product.sale_mode !== 'retail_only' ? (
                        <span className="text-sm font-bold text-green-600">M: ${product.wholesale_price_usd}</span>
                      ) : (
                        <span className="text-sm text-gray-300 line-through">M: N/A</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Aquí conectamos el botón de editar a la ruta que crearemos */}
                      <Link href={`/admin/inventory/edit/${product.id}`} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar Producto">
                        <Edit size={18} />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar Producto">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}