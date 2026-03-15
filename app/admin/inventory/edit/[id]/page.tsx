// app/admin/inventory/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { UploadCloud, Wand2, Save, ArrowLeft, X, ImagePlus, Package, DollarSign, FileText } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [removingBg, setRemovingBg] = useState(false);

  // Imágenes
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<{url: string, file: File}[]>([]);

  // Listas de la BD
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Estado del Formulario
  const [formData, setFormData] = useState({
    name: '', description: '', brand_id: '', category_id: '',
    price_usd: '', wholesale_price_usd: '', 
    boxes: '1', units_per_box: '1', sale_mode: 'both' 
  });

  // 1. Cargar las listas (Marcas/Categorías) y los DATOS DEL PRODUCTO
  useEffect(() => {
    const fetchAllData = async () => {
      // Traer listas
      const { data: bData } = await supabase.from('brands').select('*').order('name');
      const { data: cData } = await supabase.from('categories').select('*').order('name');
      if (bData) setBrands(bData);
      if (cData) setCategories(cData);

      // Traer el producto específico
      const { data: product, error } = await supabase.from('products').select('*').eq('id', productId).single();
      
      if (product) {
        // Calcular cajas inversamente (Stock / unidades por caja)
        const calculatedBoxes = product.units_per_box > 0 ? Math.floor(product.stock / product.units_per_box) : 0;

        setFormData({
          name: product.name || '',
          description: product.description || '',
          brand_id: product.brand_id || (bData?.[0]?.id || ''),
          category_id: product.category_id || (cData?.[0]?.id || ''),
          price_usd: product.price_usd?.toString() || '',
          wholesale_price_usd: product.wholesale_price_usd?.toString() || '',
          boxes: calculatedBoxes.toString(),
          units_per_box: product.units_per_box?.toString() || '1',
          sale_mode: product.sale_mode || 'both'
        });

        if (product.image_url) setMainImage(product.image_url);
        if (product.gallery_urls) setExistingGallery(product.gallery_urls);
      } else {
        alert("No se encontró el producto.");
        router.push('/admin/inventory');
      }
      setInitialLoad(false);
    };

    if (productId) fetchAllData();
  }, [productId, router]);

  const totalStock = (parseInt(formData.boxes || '0') * parseInt(formData.units_per_box || '0'));

  // --- LÓGICA DE IMÁGENES ---
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImage(URL.createObjectURL(file));
    setRemovingBg(true);

    const apiFormData = new FormData();
    apiFormData.append('image', file);

    try {
      const res = await fetch('/api/admin/remove-bg', { method: 'POST', body: apiFormData });
      const data = await res.json();
      if (data.success) setMainImage(data.base64);
      else alert("Error quitando el fondo: " + data.error);
    } catch (error) {
      console.error(error);
      alert("Error de conexión al procesar la imagen.");
    } finally {
      setRemovingBg(false);
    }
  };

  const handleNewGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newGallery = files.map(file => ({ url: URL.createObjectURL(file), file }));
    setNewGalleryFiles(prev => [...prev, ...newGallery]);
  };

  const removeExistingGalleryImage = (indexToRemove: number) => {
    setExistingGallery(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };
  const removeNewGalleryImage = (indexToRemove: number) => {
    setNewGalleryFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // --- ACTUALIZACIÓN FINAL ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalMainUrl = mainImage;
      const finalGalleryUrls: string[] = [...existingGallery];

      // 1. Si la imagen principal es nueva (base64 o blob), subirla
      if (mainImage && (mainImage.startsWith('data:image') || mainImage.startsWith('blob:'))) {
        const response = await fetch(mainImage);
        const blob = await response.blob();
        const fileName = `main-${Date.now()}.png`;
        const { error: err } = await supabase.storage.from('products').upload(fileName, blob, { contentType: 'image/png' });
        if (err) throw err;
        finalMainUrl = supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl;
      }

      // 2. Subir las nuevas imágenes de la galería
      for (let i = 0; i < newGalleryFiles.length; i++) {
        const file = newGalleryFiles[i].file;
        const fileName = `gal-${Date.now()}-${i}.${file.name.split('.').pop()}`;
        const { error: err } = await supabase.storage.from('products').upload(fileName, file);
        if (err) throw err;
        finalGalleryUrls.push(supabase.storage.from('products').getPublicUrl(fileName).data.publicUrl);
      }

      const selectedCat = categories.find(c => c.id === formData.category_id)?.name || 'General';
      const priceUSD = formData.sale_mode === 'wholesale_only' ? 0 : parseFloat(formData.price_usd);
      const wholesaleUSD = formData.sale_mode === 'retail_only' ? 0 : parseFloat(formData.wholesale_price_usd);

      // 3. ACTUALIZAR (UPDATE en lugar de INSERT)
      const { error: dbError } = await supabase.from('products').update({
        name: formData.name,
        description: formData.description,
        brand_id: formData.brand_id,
        category_id: formData.category_id,
        category: selectedCat,
        price_usd: priceUSD,
        wholesale_price_usd: wholesaleUSD,
        units_per_box: parseInt(formData.units_per_box),
        stock: totalStock,
        sale_mode: formData.sale_mode,
        image_url: finalMainUrl,
        gallery_urls: finalGalleryUrls
      }).eq('id', productId);

      if (dbError) throw dbError;

      alert("¡Producto actualizado con éxito!");
      router.push('/admin/inventory');
      router.refresh();

    } catch (error: any) {
      console.error(error);
      alert("Error al actualizar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) return <div className="p-8 text-center text-gray-500 font-bold">Cargando datos del producto...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Link href="/admin/inventory" className="flex items-center gap-2 text-gray-500 hover:text-[#e3000f] mb-6 transition-colors w-fit">
        <ArrowLeft size={20} /> Volver al Inventario
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Editando Producto</h1>
          <p className="text-gray-500 mt-1">Modifica los detalles, precios y stock del repuesto.</p>
        </div>
        <button onClick={handleSubmit} disabled={loading || removingBg} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-all flex items-center gap-2 shadow-lg">
          {loading ? 'Actualizando...' : <><Save size={20} /> Guardar Cambios</>}
        </button>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda (Datos Principales) */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText className="text-blue-600" size={20} /> Información General
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Repuesto</label>
                <input required type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción del Producto</label>
                <textarea rows={4} className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Marca</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                    value={formData.brand_id} onChange={e => setFormData({...formData, brand_id: e.target.value})}>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                    value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Multimedia (Fotos) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ImagePlus className="text-blue-600" size={20} /> Imágenes del Producto
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Portada Actual</label>
                <div className="border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center p-2 relative overflow-hidden bg-blue-50 hover:bg-blue-100 transition-colors h-48 group">
                  {!mainImage && <input type="file" accept="image/*" onChange={handleMainImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />}
                  {mainImage ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img src={mainImage} alt="Main" className="max-h-full object-contain drop-shadow-md" />
                      <button onClick={(e) => { e.preventDefault(); setMainImage(null); }} className="absolute top-1 right-1 bg-white text-red-500 hover:bg-red-500 hover:text-white border p-1.5 rounded-full z-20">
                        <X size={16} strokeWidth={3} />
                      </button>
                      {removingBg && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                          <Wand2 className="animate-spin text-blue-600 mb-1" size={24} />
                          <span className="text-[10px] font-bold text-blue-600">Procesando...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-blue-400 pointer-events-none text-center px-4">
                      <Wand2 size={32} className="mb-2" />
                      <span className="text-xs font-semibold">Cambiar Portada</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Galería (Guardadas + Nuevas)</label>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  
                  {/* Mostrar las que ya existían */}
                  {existingGallery.map((url, idx) => (
                    <div key={`exist-${idx}`} className="w-24 h-24 flex-shrink-0 border border-blue-200 rounded-lg relative overflow-hidden bg-gray-50">
                      <img src={url} alt={`Gal-${idx}`} className="w-full h-full object-cover" />
                      <button onClick={(e) => { e.preventDefault(); removeExistingGalleryImage(idx); }} className="absolute top-1 right-1 bg-white/80 text-red-500 hover:bg-red-500 hover:text-white p-1 rounded-full">
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ))}

                  {/* Mostrar las nuevas agregadas ahora */}
                  {newGalleryFiles.map((img, idx) => (
                    <div key={`new-${idx}`} className="w-24 h-24 flex-shrink-0 border-2 border-green-400 rounded-lg relative overflow-hidden bg-gray-50">
                      <img src={img.url} alt={`NewGal-${idx}`} className="w-full h-full object-cover" />
                      <button onClick={(e) => { e.preventDefault(); removeNewGalleryImage(idx); }} className="absolute top-1 right-1 bg-white/80 text-red-500 hover:bg-red-500 hover:text-white p-1 rounded-full">
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  ))}

                  <div className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg relative flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-gray-400 hover:text-gray-600">
                    <input type="file" accept="image/*" multiple onChange={handleNewGalleryChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <UploadCloud size={24} className="mb-1" />
                    <span className="text-[10px] font-medium">Añadir más</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (Precios e Inventario) */}
        <div className="space-y-8">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <DollarSign className="text-blue-600" size={20} /> Precios y Ventas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Modo de Venta Permitido</label>
                <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none bg-gray-50"
                  value={formData.sale_mode} onChange={e => setFormData({...formData, sale_mode: e.target.value})}>
                  <option value="both">Ambos (Detal y Mayor)</option>
                  <option value="retail_only">Solo Detal</option>
                  <option value="wholesale_only">Solo Mayor</option>
                </select>
              </div>

              {formData.sale_mode !== 'wholesale_only' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio Detal (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 font-bold">$</span>
                    <input required type="number" step="0.01" className="w-full border border-gray-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                      value={formData.price_usd} onChange={e => setFormData({...formData, price_usd: e.target.value})} />
                  </div>
                </div>
              )}

              {formData.sale_mode !== 'retail_only' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Precio Mayorista (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-green-500 font-bold">$</span>
                    <input required type="number" step="0.01" className="w-full border border-green-300 rounded-lg p-3 pl-8 focus:ring-2 focus:ring-green-500 focus:outline-none" 
                      value={formData.wholesale_price_usd} onChange={e => setFormData({...formData, wholesale_price_usd: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Package className="text-blue-600" size={20} /> Inventario Físico
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Cajas</label>
                  <input required type="number" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                    value={formData.boxes} onChange={e => setFormData({...formData, boxes: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Unids x Caja</label>
                  <input required type="number" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                    value={formData.units_per_box} onChange={e => setFormData({...formData, units_per_box: e.target.value})} />
                </div>
              </div>
              
              <div className="bg-gray-900 text-white p-4 rounded-xl flex items-center justify-between shadow-inner">
                <span className="text-sm font-medium text-gray-300">Nuevo Stock Total</span>
                <span className="text-2xl font-extrabold text-blue-400">{totalStock} unds</span>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}