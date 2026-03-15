// app/admin/inventory/new/page.tsx
"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { UploadCloud, Wand2, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [removingBg, setRemovingBg] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Motor', price_usd: '', wholesale_price_usd: '', stock: ''
  });

  // Manejar el archivo seleccionado
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Mostrar preview original
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    // Mandar a quitar el fondo inmediatamente
    setRemovingBg(true);
    const apiFormData = new FormData();
    apiFormData.append('image', file);

    try {
      const res = await fetch('/api/admin/remove-bg', {
        method: 'POST',
        body: apiFormData,
      });
      const data = await res.json();
      
      if (data.success) {
        setImagePreview(data.base64); // Actualizar preview con imagen sin fondo
      } else {
        alert("Error quitando el fondo: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al procesar la imagen.");
    } finally {
      setRemovingBg(false);
    }
  };

  // Guardar en la Base de Datos
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = '';

      // 1. Subir imagen limpia a Supabase Storage si existe
      if (imagePreview && imagePreview.startsWith('data:image')) {
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        const fileName = `${Date.now()}-product.png`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, blob, { contentType: 'image/png' });

        if (uploadError) throw uploadError;

        // Obtener la URL pública de la imagen
        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      // 2. Insertar los datos del producto en PostgreSQL
      const { error: dbError } = await supabase.from('products').insert([{
        name: formData.name,
        category: formData.category,
        price_usd: parseFloat(formData.price_usd),
        wholesale_price_usd: parseFloat(formData.wholesale_price_usd),
        stock: parseInt(formData.stock),
        image_url: finalImageUrl
      }]);

      if (dbError) throw dbError;

      alert("¡Producto guardado con éxito!");
      router.push('/admin/inventory');
      router.refresh();

    } catch (error: any) {
      console.error(error);
      alert("Error al guardar el producto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link href="/admin/inventory" className="flex items-center gap-2 text-gray-500 hover:text-[#e3000f] mb-6 transition-colors w-fit">
        <ArrowLeft size={20} /> Volver al Inventario
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Añadir Nuevo Repuesto</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Columna Izquierda: Datos del Producto */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Repuesto</label>
              <input required type="text" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
              <select className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e3000f] focus:outline-none"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>Motor</option><option>Frenos</option><option>Transmisión</option>
                <option>Suspensión</option><option>Accesorios</option><option>Lubricantes</option>
                <option>Eléctrico</option><option>Neumáticos</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Precio Detal ($)</label>
                <input required type="number" step="0.01" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                  value={formData.price_usd} onChange={e => setFormData({...formData, price_usd: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Precio Mayor ($)</label>
                <input required type="number" step="0.01" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                  value={formData.wholesale_price_usd} onChange={e => setFormData({...formData, wholesale_price_usd: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Inicial (Cantidad)</label>
              <input required type="number" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#e3000f] focus:outline-none" 
                value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>
          </div>

          {/* Columna Derecha: Imagen e IA */}
          <div className="flex flex-col">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Foto del Producto (La IA quitará el fondo)</label>
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              
              {imagePreview ? (
                <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-64 object-contain drop-shadow-md" />
                  {removingBg && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                      <Wand2 className="animate-spin text-[#e3000f] mb-2" size={32} />
                      <span className="text-sm font-bold text-gray-800">Magia en proceso...</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-400 group-hover:text-[#e3000f] transition-colors">
                  <UploadCloud size={48} className="mb-2" />
                  <span className="font-medium text-sm">Haz clic o arrastra una foto aquí</span>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-4">
            <button disabled={loading || removingBg} type="submit" className="w-full bg-[#e3000f] text-white py-3.5 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-400 transition-all flex items-center justify-center gap-2">
              {loading ? 'Guardando en Base de Datos...' : <><Save size={20} /> Guardar Producto Oficial</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}